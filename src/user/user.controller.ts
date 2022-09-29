import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { ExpressRequestInterface } from 'src/types/expressRequest.interface';
import { Roles } from './decorators/role.decorator';
import { User } from './decorators/user.decorator';
import { UserEntity } from './entity/user.entity';
import { RoleGuard } from './guards/role.guard';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRolesEnum.Ghost)
  @UseGuards(AuthGuard, RoleGuard)
  async currentUser(
    @Req() request: ExpressRequestInterface,
    @User() user: UserEntity,
  ): Promise<UserEntity> {
    return user;
  }
}
