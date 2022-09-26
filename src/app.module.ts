import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { typeOrmAsyncConfig } from './config/typeorm.config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env` }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    AuthModule,
    UserModule,
    EmailModule,
    ArticleModule,
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
