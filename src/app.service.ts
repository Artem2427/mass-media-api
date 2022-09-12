import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.DATABASE_URL, 'process.env.DATABASE_URL');
    return 'Hello World!';
  }
}
