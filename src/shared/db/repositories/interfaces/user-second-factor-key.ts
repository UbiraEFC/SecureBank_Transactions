import { UserSecondFactorKeyEntity } from '../../entities';

export interface IUserSecondFactorKeyRepository {
  generate(userId: string, key: string): Promise<void>;
  removeUnvalidatedKeys(userId: string): Promise<void>;
  findByUserId(userId: string, validated: boolean): Promise<UserSecondFactorKeyEntity>;
  changeValidKey(userId: string): Promise<void>;
}
