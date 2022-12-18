import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IS_REQUIRED, IS_STRING } from 'src/core/errorsFieldMessage/messages';

export class ActivationLinkQuery {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: IS_REQUIRED })
  @IsString({ message: IS_STRING })
  readonly link: string;
}
