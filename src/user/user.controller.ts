import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExpressRequestInterface } from 'src/types/expressRequest.interface';
import { User } from './decorators/user.decorator';
import { UserEntity } from './entities/user.entity';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async currentUser(
    @Req() request: ExpressRequestInterface,
    @User() user: UserEntity,
  ): Promise<UserEntity> {
    return user;
  }
}
