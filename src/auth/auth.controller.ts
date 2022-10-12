import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  Query,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

import { CreateUserDTO } from './dto/createUser.dto';
import { LoginUserDTO } from './dto/loginUser.dto';

import { RegistrationResponseInterface } from './types/common';
import { AccessTokenType } from './types/tokens.interface';
import { UNAUTHORIZED } from './errors/errors';
// import { ActivationLinkQuery } from './dto/activationQuery.dto';
import { ActivateByCodeDTO } from './dto/activeteByCode.dto';
import { ResendCodeDTO } from './dto/resendCode.dto';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';

@ApiTags('Authorization user')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: CreateUserDTO })
  @ApiCreatedResponse({
    description: 'User Registration',
  })
  @Post('registration')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDTO,
  ): Promise<RegistrationResponseInterface> {
    const registrationUser = await this.authService.registrationUser(
      createUserDto,
    );

    response.cookie('refreshToken', registrationUser.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return { userEmail: registrationUser.userEmail };
  }

  @ApiOperation({ summary: 'Activete your account by code' })
  @ApiBody({ type: ActivateByCodeDTO })
  @ApiOkResponse({ description: 'Account is activated' })
  @Post('activate-by-code')
  @HttpCode(HttpStatus.OK)
  async activeteAccountByCode(@Body() activeteDTO: ActivateByCodeDTO) {
    return this.authService.activeteAccountByCode(activeteDTO);
  }

  @ApiOperation({ summary: 'Resend activated code' })
  @ApiBody({ type: ResendCodeDTO })
  @ApiOkResponse({ description: 'Account is activated' })
  @Post('resend-activation-code')
  @HttpCode(HttpStatus.OK)
  async resendActivatedCode(@Body() resendCodeDTO: ResendCodeDTO) {
    return await this.authService.resendActivatedCode(resendCodeDTO);
  }

  @ApiOperation({ summary: 'Log in' })
  @ApiBody({ type: LoginUserDTO })
  @ApiOkResponse({ description: 'User login' })
  @Post('login')
  @UsePipes(new ValidationPipe())
  async logIn(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginUserDTO,
  ): Promise<AccessTokenType> {
    const tokens = await this.authService.login(loginUserDto);

    response.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return { accessToken: tokens.accessToken };
  }

  @ApiOperation({ summary: 'Send forgot password letter' })
  @ApiBody({ type: ResendCodeDTO })
  @ApiOkResponse({ description: 'Letter was sent on your email' })
  @ApiNotFoundResponse({ description: 'User with this email not found' })
  @Post('forgot-password')
  async forgotPassword(@Body() forgetPasswordDTO: ResendCodeDTO) {
    return await this.authService.forgotPassword(forgetPasswordDTO);
  }

  @ApiOperation({ summary: 'Set new password' })
  @ApiBody({ type: UpdatePasswordDTO })
  @ApiOkResponse({ description: 'Password was successfully changed' })
  @Patch('update-password')
  async updatePassword(@Body() updatePasswordDTO: UpdatePasswordDTO) {
    return await this.authService.updatePassword(updatePasswordDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'User logout' })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken');
  }

  // @ApiBearerAuth('JWT-auth')
  // @ApiOperation({ summary: 'Activation link' })
  // @ApiOkResponse({ description: 'Account is activated' })
  // // @ApiQuery({ type: ActivationLinkQuery })
  // @Get('activate')
  // async getActivateLink(
  //   @Res() response: Response,
  //   @Query() query: ActivationLinkQuery,
  // ) {
  //   await this.authService.activate(query.link);

  //   return response.redirect(process.env.CLIENT_URL);
  // }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check refresh token' })
  @Get('refresh')
  async getRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessTokenType> {
    const { refreshToken } = request.cookies;
    const tokens = await this.authService.refresh(refreshToken);

    return { accessToken: tokens.accessToken };
  }
}
