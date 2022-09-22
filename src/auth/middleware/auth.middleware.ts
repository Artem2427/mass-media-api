import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from 'src/types/expressRequest.interface';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const tokenAccess = req.headers.authorization.split(' ')[1];

    try {
      const userData = this.authService.validateToken(
        tokenAccess,
        process.env.JWT_ACCESS_SECRET,
      );

      const user = await this.userService.findByEmail(userData.email);

      req.user = user;
      next();
      return;
    } catch (error) {
      req.user = null;
      next();
      return;
    }
  }
}
