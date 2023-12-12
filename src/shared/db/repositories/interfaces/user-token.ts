import { TokenType } from '@src/models/enumerators/TokensEnum';

import UserTokenEntity from '../../entities/user-token';

export interface IUserTokenRepository {
  createOrUpdate(userToken: UserTokenEntity): Promise<UserTokenEntity>;
  findByUserIdAndTokenType(userId: string, tokenType: TokenType): Promise<UserTokenEntity>;
  findByTokenAndTokenType(token: string, tokenType: TokenType): Promise<UserTokenEntity>;
  deleteById(id: string): Promise<void>;
}
