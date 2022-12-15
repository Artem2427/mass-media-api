import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ActivateByCodeDTO {
  @ApiProperty({ type: String, name: 'code', required: true })
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @ApiProperty({ type: String, name: 'email', required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
