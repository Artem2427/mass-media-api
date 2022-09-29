import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';

import { CreateUserDTO } from './dto/createUser.dto';
import {
  CANNOT_LOGIN_WITHOUT_ACTIVATE_YOUR_ACCOUNT,
  EMAIL_OR_USERNAME_ARE_TAKEN,
  INCORRECT_ACTIVATION_LINK,
  INVALID_CREDETIALS,
  UNAUTHORIZED,
} from './errors/errors';

import { UserEntity } from 'src/user/entity/user.entity';

import 'dotenv/config';
import { LoginUserDTO } from './dto/loginUser.dto';
import {
  AccessTokenType,
  TokenDecodeData,
  TokensInterface,
} from './types/tokens.interface';
import { RegistrationResponseInterface } from './types/common';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

    const activationLink = uuid.v4(); // dsf443j-rdfg43-34tfdg

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto, { activationLink });

    return await this.userRepository.save(newUser);
  }

  async registrationUser(
    createUserDto: CreateUserDTO,
  ): Promise<RegistrationResponseInterface & TokensInterface> {
    const user = await this.createUser(createUserDto);

    await this.sendActivationEmail(
      user,
      `${process.env.API_URL}/api/auth/activate?link=${user.activationLink}`,
    );

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

  async sendActivationEmail(user: UserEntity, link: string): Promise<void> {
    this.emailService.sendLetter({
      to: user.email,
      filePath: './views/activationEmail.hjs',
      subject: 'Активація аккаунта',
      context: {
        link,
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
        'activationLink',
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

  async activate(activationLink: string) {
    const user = await this.userRepository.findOne({
      where: { activationLink },
    });

    if (!user) {
      throw new HttpException(INCORRECT_ACTIVATION_LINK, HttpStatus.NOT_FOUND);
    }

    user.isActivated = true;
    await this.userRepository.save(user);
  }

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
