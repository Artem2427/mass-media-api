import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');

  app.use(cookieParser());
  await app.listen(process.env.PORT || 5000);
}
bootstrap();

//psql --host=ec2-52-207-90-231.compute-1.amazonaws.com --username=qcppirmxroywrf --password=fc49a095479a15caf403c2e103157ee350743ca4683040b312fa74d200b37ced --dbname=dc2s7m2svfh9dj
