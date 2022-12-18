import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IS_EMAIL,
  IS_REQUIRED,
  IS_STRING,
  IS_UUID,
  MIN_LENGTH,
} from 'src/core/errorsFieldMessage/messages';

export class CreateUserDTO {
  @ApiProperty({ type: String, name: 'firstName', required: true })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsString({ message: IS_STRING })
  readonly firstName: string;

  @ApiProperty({ type: String, name: 'lastName', required: true })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsString({ message: IS_STRING })
  readonly lastName: string;

  @ApiProperty({ type: String, name: 'email', required: true })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsEmail({}, { message: IS_EMAIL })
  readonly email: string;

  @ApiProperty({ type: String, name: 'password', required: true, minLength: 5 })
  @IsNotEmpty({ message: IS_REQUIRED })
  @MinLength(5, { message: MIN_LENGTH(5) })
  readonly password: string;

  @ApiProperty({ type: String, name: 'userName', required: true })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsString({ message: IS_STRING })
  readonly userName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsString({ message: IS_STRING })
  @IsUUID('all', { each: true, message: IS_UUID })
  readonly cityId: string;
}
