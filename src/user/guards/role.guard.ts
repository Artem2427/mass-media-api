import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExpressRequestInterface } from 'src/types/expressRequest.interface';

import { ROLES_KEY } from '../decorators/role.decorator';
import { FORBIDDEN_FOR_ROLE } from '../errors/errors';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<ExpressRequestInterface>();

    if (request.user) {
      return request.user.roles.some((role) => requiredRoles.includes(role));
    }

    throw new HttpException(FORBIDDEN_FOR_ROLE, HttpStatus.FORBIDDEN);
  }
}
