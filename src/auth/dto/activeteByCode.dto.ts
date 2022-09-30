import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ActivateByCodeDTO {
  @ApiProperty({ type: String, name: 'code', required: true })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String, name: 'email', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
