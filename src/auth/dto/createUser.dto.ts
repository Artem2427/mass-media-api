import { UserRolesEnum } from 'src/core/enums/userRole.enum';

import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @IsOptional()
  @IsEnum(UserRolesEnum)
  readonly role?: UserRolesEnum;
}
