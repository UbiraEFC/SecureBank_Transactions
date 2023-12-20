import { injectable } from 'inversify';

import { AccountEntity } from '../entities';
import { typeormDataSource } from '../typeorm/data-source';
import { IAccountRepository } from './interfaces/account';

@injectable()
export class AccountRepository implements IAccountRepository {
  private accountRepository = typeormDataSource.getRepository(AccountEntity);

  async create(account: AccountEntity): Promise<AccountEntity> {
    return this.accountRepository.save(account);
  }

  async findByAccountId(id: string): Promise<AccountEntity> {
    return this.accountRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<AccountEntity> {
    return this.accountRepository.findOne({ where: { userId } });
  }

  async findByAccountNumber(accountNumber: number): Promise<AccountEntity> {
    return this.accountRepository.findOne({ where: { accountNumber } });
  }

  async updateBalance(account: AccountEntity): Promise<AccountEntity> {
    return this.accountRepository.save(account);
  }
}
