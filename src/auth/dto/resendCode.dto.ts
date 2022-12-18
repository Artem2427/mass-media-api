import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IS_EMAIL, IS_REQUIRED } from 'src/core/errorsFieldMessage/messages';

export class ResendCodeDTO {
  @ApiProperty({ type: String, name: 'email', required: true })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsEmail({}, { message: IS_EMAIL })
  readonly email: string;
}
