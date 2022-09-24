export interface TokensInterface {
  accessToken: string;
  refreshToken: string;
}

export interface TokenDecodeData {
  userName: string;
  email: string;
}

export type AccessTokenType = Omit<TokensInterface, 'refreshToken'>;
