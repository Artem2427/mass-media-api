import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(response: any, statusCode: number = HttpStatus.BAD_REQUEST) {
    super(response, statusCode);
  }
}
