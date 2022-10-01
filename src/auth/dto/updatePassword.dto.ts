import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDTO {
  @ApiProperty({
    type: String,
    name: 'forgotPasswordLink',
    required: true,
  })
  @IsNotEmpty()
  forgotPasswordLink: string;

  @ApiProperty({
    type: String,
    name: 'newPassword',
    required: true,
    minLength: 5,
  })
  @IsNotEmpty()
  @MinLength(5)
  newPassword: string;
}
