import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { EmailService } from 'src/email/email.service';

import { UserEntity } from 'src/user/entity/user.entity';
import { ActivationCodeEntity } from './entity/activation-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ActivationCodeEntity])],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
