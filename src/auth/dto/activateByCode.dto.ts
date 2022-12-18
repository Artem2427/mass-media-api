import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  IS_EMAIL,
  IS_REQUIRED,
  IS_STRING,
} from 'src/core/errorsFieldMessage/messages';

export class ActivateByCodeDTO {
  @ApiProperty({ type: String, name: 'code', required: true })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsString({ message: IS_STRING })
  readonly code: string;

  @ApiProperty({ type: String, name: 'email', required: true })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsEmail({}, { message: IS_EMAIL })
  readonly email: string;
}
