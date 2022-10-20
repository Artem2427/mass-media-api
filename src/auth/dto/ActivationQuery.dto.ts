import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ActivationLinkQuery {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  readonly link: string;
}
