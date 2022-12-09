import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');

  // app.enableCors({ origin: 'http://localhost:3000' });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Mass-media API')
    .setDescription('Documentations REST API')
    .setVersion('1.0.0')
    .addServer('https://mass-media-db.herokuapp.com/')
    .addBearerAuth(
      {
        type: 'http',
        description: 'Enter JWT token',
        scheme: 'bearer',
        name: 'Authorization',
        in: 'header',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT);
}
bootstrap();

//psql --host=ec2-54-75-184-144.eu-west-1.compute.amazonaws.com --username=rlayvbswtwgacg --password=41a2e5e9e74f858417e9eae7b5822de19475f8d278b250ddc3c38230d717c0eb --dbname=dfbbhkbe2ehe19
