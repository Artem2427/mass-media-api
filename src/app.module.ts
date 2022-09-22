import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { typeOrmAsyncConfig } from './config/typeorm.config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { MailerModule } from '@nestjs-modules/mailer';
import { AuthMiddleware } from './auth/middleware/auth.middleware';

// vltjlczpzmitgbjd;
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'artem.danko.2k18@gmail.com',
          pass: 'vltjlczpzmitgbjd',
        },
      },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
