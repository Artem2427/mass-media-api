import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserRolesEnum } from 'src/core/enums/userRole.enum';

export class CreateUserDTO {
  @ApiProperty({ type: String, name: 'firstName', required: true })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({ type: String, name: 'lastName', required: true })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({ type: String, name: 'email', required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String, name: 'password', required: true, minLength: 5 })
  @IsNotEmpty()
  @MinLength(5)
  readonly password: string;

  @ApiProperty({ type: String, name: 'userName', required: true })
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @ApiPropertyOptional({
    enum: UserRolesEnum,
    isArray: true,
    default: UserRolesEnum.Ghost,
  })
  @IsOptional()
  @IsEnum(UserRolesEnum)
  readonly roles?: UserRolesEnum[];
}
