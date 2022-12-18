import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IS_REQUIRED,
  IS_STRING,
  MIN_LENGTH,
  IS_EMAIL,
} from 'src/core/errorsFieldMessage/messages';

export class LoginUserDTO {
  @ApiProperty({ type: String, name: 'email', required: true })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsEmail({}, { message: IS_EMAIL })
  readonly email: string;

  @ApiProperty({ type: String, name: 'password', required: true, minLength: 5 })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsString({ message: IS_STRING })
  @MinLength(5, { message: MIN_LENGTH(5) })
  readonly password: string;
}
