import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';

import { ITransactionDTO } from '@src/models/DTOs/transaction/ITransactionDTOs';
import { TransactionType } from '@src/models/enumerators/TransactionEnum';
import { AccountEntity, TransactionEntity } from '@src/shared/db/entities';
import { IAccountRepository } from '@src/shared/db/repositories/interfaces/account';
import { typeormDataSource } from '@src/shared/db/typeorm/data-source';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import TYPES from '@src/utils/types';

import { IDepositUseCase, IDepositUseCaseRequest } from './deposit.interface';

@injectable()
export class DepositUseCase implements IDepositUseCase {
  constructor(@inject(TYPES.AccountRepository) private readonly accountRepository: IAccountRepository) {}

  async execute({ session, amount }: IDepositUseCaseRequest): Promise<ITransactionDTO> {
    const account = await this.accountRepository.findByAccountId(session.userId);

    if (!account) throw new BusinessError(BusinessErrorCodes.ACCOUNT_NOT_FOUND);

    const transaction: ITransactionDTO = {
      amount,
      type: TransactionType.DEPOSIT,
      sourceId: account.id,
      destinationId: account.id,
      createdAt: DateTime.utc().toJSDate(),
    };

    const queryRunner = typeormDataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      account.balance = parseFloat(account.balance.toString()) + parseFloat(amount.toString());

      await queryRunner.manager.save(AccountEntity, account);
      await queryRunner.manager.save(TransactionEntity, transaction);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return transaction;
  }
}
