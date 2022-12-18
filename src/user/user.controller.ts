import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { ExpressRequestInterface } from 'src/types/expressRequest.interface';
import { Roles } from './decorators/role.decorator';
import { User } from './decorators/user.decorator';
import { UserEntity } from './entity/user.entity';
import { RoleGuard } from './guards/role.guard';

import { UserService } from './user.service';

@ApiTags('Users flow')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user data' })
  @ApiOkResponse({ type: UserEntity })
  @Get()
  // @Roles(UserRolesEnum.User)
  @UseGuards(AuthGuard, RoleGuard)
  async currentUser(@User('email') email: string): Promise<UserEntity> {
    return await this.userService.findOneWithRelations(email);
  }
}
