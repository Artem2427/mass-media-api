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
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { Response, Request } from 'express';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegistrationResponseInterface } from './types/common';
import { AccessTokenType } from './types/tokens.interface';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationResponseInterface> {
    const registrationUser = await this.authService.registrationUser(
      createUserDto,
    );

    // response.cookie('refreshToken', registrationUser.tokens.refreshToken, {
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    // });

    return registrationUser;
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async logIn(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<AccessTokenType> {
    const tokens = await this.authService.login(loginUserDto);

    response.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;

    try {
      await this.authService.logout(refreshToken);
      response.clearCookie('refreshToken');
    } catch (error) {}

    return { message: 'You are logged out' };
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
