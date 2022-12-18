import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import {
  IS_REQUIRED,
  IS_STRING,
  MIN_LENGTH,
} from 'src/core/errorsFieldMessage/messages';

export class UpdatePasswordDTO {
  @ApiProperty({
    type: String,
    name: 'forgotPasswordLink',
    required: true,
  })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsString({ message: IS_STRING })
  readonly forgotPasswordLink: string;

  @ApiProperty({
    type: String,
    name: 'newPassword',
    required: true,
    minLength: 5,
  })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsString({ message: IS_STRING })
  @MinLength(5, { message: MIN_LENGTH(5) })
  readonly newPassword: string;
}
