import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendCodeDTO {
  @ApiProperty({ type: String, name: 'email', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
