import { ApiProperty } from '@nestjs/swagger';

export class ActivationLinkQuery {
  @ApiProperty({ type: String, required: true })
  link: string;
}
