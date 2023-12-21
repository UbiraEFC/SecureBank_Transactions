import { AccountEntity } from '../../entities';

export interface IAccountRepository {
  create(account: AccountEntity): Promise<AccountEntity>;
  findByAccountId(accountId: string): Promise<AccountEntity>;
  findByUserId(userId: string): Promise<AccountEntity>;
  findByAccountNumber(accountNumber: number): Promise<AccountEntity>;
  updateBalance(account: AccountEntity): Promise<AccountEntity>;
}
