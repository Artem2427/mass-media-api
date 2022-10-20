import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDTO {
  @ApiProperty({
    type: String,
    name: 'forgotPasswordLink',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly forgotPasswordLink: string;

  @ApiProperty({
    type: String,
    name: 'newPassword',
    required: true,
    minLength: 5,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly newPassword: string;
}
