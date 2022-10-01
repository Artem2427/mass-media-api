import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';

import { CreateUserDTO } from './dto/createUser.dto';
import {
  ACCOUNT_HAS_BEEN_ALREADY_ACTIVATED,
  CANNOT_LOGIN_WITHOUT_ACTIVATE_YOUR_ACCOUNT,
  CODE_IS_NOT_CORRECT,
  EMAIL_OR_USERNAME_ARE_TAKEN,
  INVALID_CREDETIALS,
  NOT_REGISTRATION,
  UNAUTHORIZED,
} from './errors/errors';

import { UserEntity } from 'src/user/entity/user.entity';
import { ActivationCodeEntity } from './entity/activation-code.entity';

import { EmailService } from 'src/email/email.service';

import 'dotenv/config';
import { LoginUserDTO } from './dto/loginUser.dto';
import {
  AccessTokenType,
  TokenDecodeData,
  TokensInterface,
} from './types/tokens.interface';
import { RegistrationResponseInterface } from './types/common';
import { randomCode } from 'src/core/utils/random-code';
import { ActivateByCodeDTO } from './dto/activeteByCode.dto';
import { ResendCodeDTO } from './dto/resendCode.dto';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ActivationCodeEntity)
    private readonly activationCodeRepository: Repository<ActivationCodeEntity>,
    private readonly emailService: EmailService,
  ) {}

  async createUser(createUserDto: CreateUserDTO): Promise<UserEntity> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .orWhere('users.email = :email', { email: createUserDto.email })
      .orWhere('users.userName = :userName', {
        userName: createUserDto.userName,
      });

    const candidate = await queryBuilder.getOne();

    if (candidate) {
      throw new HttpException(
        EMAIL_OR_USERNAME_ARE_TAKEN,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const forgotPasswordLink = uuid.v4(); // dsf443j-rdfg43-34tfdg

    const code = randomCode(6);

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto, { forgotPasswordLink });

    const activationCode = new ActivationCodeEntity();
    activationCode.code = code;

    newUser.activationCode = activationCode;

    return await this.userRepository.save(newUser);
  }

  // `${process.env.API_URL}/api/auth/activate?link=${user.activationLink}`

  async registrationUser(
    createUserDto: CreateUserDTO,
  ): Promise<RegistrationResponseInterface & TokensInterface> {
    const user = await this.createUser(createUserDto);

    await this.sendActivationEmail(user);

    const tokens = this.generateTokens({
      userName: user.userName,
      email: user.email,
    });

    //TODO
    // return link for user email: `mailto:${user.email}`

    return {
      userEmail: user.email,
      ...tokens,
    };
  }

  async activeteAccountByCode(activeteDTO: ActivateByCodeDTO) {
    const activationCode = await this.activationCodeRepository
      .createQueryBuilder('activationCode')
      .leftJoinAndSelect('activationCode.user', 'user')
      .where('user.email = :email', { email: activeteDTO.email })
      .getOne();

    const user = await this.userRepository.findOne({
      where: { email: activeteDTO.email },
    });
    if (user && user.isActivated) {
      throw new HttpException(
        ACCOUNT_HAS_BEEN_ALREADY_ACTIVATED,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!activationCode) {
      throw new HttpException(NOT_REGISTRATION, HttpStatus.NOT_FOUND);
    }

    if (activationCode.code !== activeteDTO.code) {
      throw new HttpException(CODE_IS_NOT_CORRECT, HttpStatus.BAD_REQUEST);
    }

    user.isActivated = true;
    await this.userRepository.save(user);
    await this.activationCodeRepository.remove(activationCode);

    return {
      success: true,
    };
  }

  async resendActivatedCode(resendCodeDTO: ResendCodeDTO) {
    const activationCode = await this.activationCodeRepository
      .createQueryBuilder('activationCode')
      .leftJoinAndSelect('activationCode.user', 'user')
      .where('user.email = :email', { email: resendCodeDTO.email })
      .getOne();

    if (!activationCode) {
      throw new HttpException(NOT_REGISTRATION, HttpStatus.NOT_FOUND);
    }

    if (activationCode.user.isActivated) {
      throw new HttpException(
        ACCOUNT_HAS_BEEN_ALREADY_ACTIVATED,
        HttpStatus.BAD_REQUEST,
      );
    }
    const code = randomCode(6);
    activationCode.code = code;

    await this.activationCodeRepository.save(activationCode);

    this.emailService.sendLetter({
      to: resendCodeDTO.email,
      filePath: './views/resendActivatedCode.hjs',
      subject: 'Новий код ативації',
      context: {
        code: code.split('').map((character) => {
          return {
            symbol: character,
          };
        }),
      },
    });
    return {
      success: true,
    };
  }

  async sendActivationEmail(user: UserEntity): Promise<void> {
    await this.emailService.sendLetter({
      to: user.email,
      filePath: './views/activationEmail.hjs',
      subject: 'Активація аккаунта',
      context: {
        code: user.activationCode.code.split('').map((character) => {
          return {
            symbol: character,
          };
        }),
        name: user.firstName,
      },
    });
  }

  async login(loginUserDto: LoginUserDTO): Promise<TokensInterface> {
    const user = await this.userRepository.findOne({
      select: [
        'firstName',
        'lastName',
        'userName',
        'password',
        'email',
        'bio',
        'phone',
        'avatar',
        'isActivated',
        'forgotPasswordLink',
        'roles',
      ],
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new HttpException(INVALID_CREDETIALS, HttpStatus.NOT_FOUND);
    }

    const isPassEquals = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPassEquals) {
      throw new HttpException(INVALID_CREDETIALS, HttpStatus.NOT_FOUND);
    }

    if (!user.isActivated) {
      throw new HttpException(
        CANNOT_LOGIN_WITHOUT_ACTIVATE_YOUR_ACCOUNT,
        HttpStatus.PRECONDITION_REQUIRED,
      );
    }

    delete user.password;

    const tokens = this.generateTokens({
      userName: user.userName,
      email: user.email,
    });

    return tokens;
  }

  async refresh(refreshToken: string): Promise<AccessTokenType> {
    if (!refreshToken) {
      throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const userData = this.validateToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    if (!userData) {
      throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    const tokens = this.generateTokens({
      userName: user.userName,
      email: user.email,
    });

    return {
      accessToken: tokens.accessToken,
    };
  }

  // `${process.env.API_URL}/api/auth/activate?link=${user.activationLink}`

  async forgotPassword(forgetPasswordDTO: ResendCodeDTO) {
    const user = await this.userRepository.findOne({
      where: { email: forgetPasswordDTO.email },
    });
    if (!user) {
      throw new HttpException(NOT_REGISTRATION, HttpStatus.NOT_FOUND);
    }

    await this.emailService.sendLetter({
      to: user.email,
      filePath: './views/forgotPassword.hjs',
      subject: 'Востановити пароль',
      context: {
        link: `${process.env.CLIENT_URL}forgot-password/?userLink=${user.forgotPasswordLink}`,
        name: user.firstName,
      },
    });
  }

  async updatePassword(updatePasswordDTO: UpdatePasswordDTO) {
    const user = await this.userRepository.findOne({
      select: [
        'id',
        'firstName',
        'lastName',
        'userName',
        'password',
        'email',
        'bio',
        'phone',
        'avatar',
        'isActivated',
        'forgotPasswordLink',
        'roles',
      ],
      where: { forgotPasswordLink: updatePasswordDTO.forgotPasswordLink },
    });

    if (!user) {
      throw new HttpException(NOT_REGISTRATION, HttpStatus.NOT_FOUND);
    }

    user.password = await bcrypt.hash(updatePasswordDTO.newPassword, 10);

    await this.userRepository.save(user);

    return {
      success: true,
    };
  }

  // async activate(activationLink: string) {
  //   const user = await this.userRepository.findOne({
  //     where: { activationLink },
  //   });

  //   if (!user) {
  //     throw new HttpException(INCORRECT_ACTIVATION_LINK, HttpStatus.NOT_FOUND);
  //   }

  //   user.isActivated = true;
  //   await this.userRepository.save(user);
  // }

  validateToken(token: string, secret: string): TokenDecodeData | null {
    try {
      const userData = <TokenDecodeData>jwt.verify(token, secret);
      return userData;
    } catch (error) {
      return null;
    }
  }

  generateTokens(secretData: TokenDecodeData): TokensInterface {
    const accessToken = jwt.sign(secretData, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '2h',
    });

    const refreshToken = jwt.sign(secretData, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
