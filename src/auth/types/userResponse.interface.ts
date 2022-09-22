import { TokensInterface } from './tokens.interface';
import { UserType } from './user.type';

export interface UserResponseInterface {
  user: UserType;
  tokens: TokensInterface;
}
