import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/createUser.dto';
import {
  CANNOT_LOGIN_WITHOUT_ACTIVATE_YOUR_ACCOUNT,
  EMAIL_OR_USERNAME_ARE_TAKEN,
  INCORRECT_ACTIVATION_LINK,
  INVALID_CREDETIALS,
  UNAUTHORIZED,
} from './errors/errors';

import { UserEntity } from 'src/user/entities/user.entity';
import { SessionEntity } from './entities/session.entity';

import { UserResponseInterface } from './types/userResponse.interface';
import { MailerService } from '@nestjs-modules/mailer';

import 'dotenv/config';
import { LoginUserDto } from './dto/loginUser.dto';
import { TokenDecodeData } from './types/tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
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
    createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.createUser(createUserDto);

    await this.sendActivationEmail(
      user.email,
      `${process.env.API_URL}/api/auth/activate?link=${user.activationLink}`,
    );

    const tokens = this.generateTokens({
      userName: user.userName,
      email: user.email,
    });

    await this.saveToken(user, tokens.refreshToken);

    //TODO
    // return link for user email: `mailto:${user.email}`

    return {
      user,
      tokens,
    };
  }

  async sendActivationEmail(to: string, link: string): Promise<void> {
    this.mailerService
      .sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Активація аккаунта на ' + process.env.API_URL,
        text: '',
        html: `
          <div>
            <h1>Для активації перейдіть по силці</h1>
            <a href=${link}>${link}</a>
          </div>
        `,
      })
      .then((r) => {
        console.log(r, 'Email is sent');
      })
      .catch((e) => {
        console.log(e, 'Error sending email');
      });
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
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
        'role',
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

    await this.saveToken(user, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  async logout(refreshToken: string) {
    const token = await this.removeToken(refreshToken);

    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const userData = this.validateToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    const tokenFromDb = await this.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    const tokens = this.generateTokens({
      userName: user.userName,
      email: user.email,
    });

    await this.saveToken(user, tokens.refreshToken);

    return {
      user,
      tokens,
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

  async findToken(refreshToken: string) {
    return await this.sessionRepository.findOne({ where: { refreshToken } });
  }

  generateTokens(secretData: TokenDecodeData) {
    const accessToken = jwt.sign(secretData, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });

    const refreshToken = jwt.sign(secretData, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(user: UserEntity, refreshToken: string) {
    const oldSession = await this.sessionRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    if (oldSession) {
      oldSession.refreshToken = refreshToken;
      return await this.sessionRepository.save(oldSession);
    }

    const newSession = new SessionEntity();
    newSession.refreshToken = refreshToken;
    newSession.user = user;

    return await this.sessionRepository.save(newSession);
  }

  async removeToken(refreshToken: string) {
    return await this.sessionRepository.delete({ refreshToken });
  }
}