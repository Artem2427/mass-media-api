import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { EmailService } from 'src/email/email.service';

import { UserEntity } from 'src/user/entity/user.entity';
import { ActivationCodeEntity } from './entity/activation-code.entity';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ActivationCodeEntity]),
    CityModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
