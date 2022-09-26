import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Mass-media API')
    .setDescription('Documentations REST API')
    .setVersion('1.0.0')
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

  await app.listen(PORT, () => console.log(`Server started on port - ${PORT}`));
}
bootstrap();

//psql --host=ec2-52-207-90-231.compute-1.amazonaws.com --username=qcppirmxroywrf --password=fc49a095479a15caf403c2e103157ee350743ca4683040b312fa74d200b37ced --dbname=dc2s7m2svfh9dj
