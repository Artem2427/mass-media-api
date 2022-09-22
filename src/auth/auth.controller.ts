import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { Response, Request } from 'express';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const registrationUser = await this.authService.registrationUser(
      createUserDto,
    );

    response.cookie('refreshToken', registrationUser.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return registrationUser;
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async logIn(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginUserDto,
  ) {
    const userData = await this.authService.login(loginUserDto);

    response.cookie('refreshToken', userData.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return userData;
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;
    const token = await this.authService.logout(refreshToken);
    response.clearCookie('refreshToken');
    return token;
  }

  @Get('activate')
  async getActivateLink(
    @Res() response: Response,
    @Query('link') link: string,
  ) {
    await this.authService.activate(link);

    return response.redirect(process.env.CLIENT_URL);
  }

  @Get('refresh')
  async getRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;
    const tokens = await this.authService.refresh(refreshToken);
  }

  @Get('users')
  async findAllUsers() {}
}
