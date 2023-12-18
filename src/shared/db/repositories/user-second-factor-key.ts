import { injectable } from 'inversify';
import { DateTime } from 'luxon';

import { UserSecondFactorKeyEntity } from '../entities';
import { typeormDataSource } from '../typeorm/data-source';
import { IUserSecondFactorKeyRepository } from './interfaces/user-second-factor-key';

@injectable()
export class UserSecondFactorKeyRepository implements IUserSecondFactorKeyRepository {
  private userSecondFactorKeyRepository = typeormDataSource.getRepository(UserSecondFactorKeyEntity);

  async changeValidKey(userId: string): Promise<void> {
    await this.userSecondFactorKeyRepository
      .createQueryBuilder()
      .update()
      .set({ validated: true, updatedAt: DateTime.now().toJSDate() })
      .where('userId = :userId and validated = :validated', {
        userId,
        validated: false,
      })
      .execute();
  }

  async findByUserId(userId: string, validated: boolean): Promise<UserSecondFactorKeyEntity> {
    const key = await this.userSecondFactorKeyRepository.findOne({
      where: { userId, validated },
    });
    return key;
  }

  async removeUnvalidatedKeys(userId: string): Promise<void> {
    await this.userSecondFactorKeyRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId and validated = :validated', {
        userId,
        validated: false,
      })
      .execute();
  }

  async generate(userId: string, key: string): Promise<void> {
    await this.userSecondFactorKeyRepository.save({
      key,
      userId,
      validated: false,
    });
  }
}
