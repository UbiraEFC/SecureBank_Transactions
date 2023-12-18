import { injectable } from 'inversify';

import { TokenType } from '@src/models/enumerators/TokensEnum';

import UserTokenEntity from '../entities/user-token';
import { typeormDataSource } from '../typeorm/data-source';
import { IUserTokenRepository } from './interfaces/user-token';

@injectable()
export class UserTokenRepository implements IUserTokenRepository {
  private userTokenRepository = typeormDataSource.getRepository(UserTokenEntity);

  async createOrUpdate(userToken: UserTokenEntity): Promise<UserTokenEntity> {
    return this.userTokenRepository.save(userToken);
  }

  async findByUserIdAndTokenType(userId: string, tokenType: TokenType): Promise<UserTokenEntity> {
    return this.userTokenRepository.findOne({ where: { userId, tokenType } });
  }

  async deleteById(id: string): Promise<void> {
    await this.userTokenRepository.softDelete(id);
  }

  async findByTokenAndTokenType(token: string): Promise<UserTokenEntity> {
    return this.userTokenRepository.findOne({ where: { token } });
  }
}
