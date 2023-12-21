import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';

import { ITransactionDTO } from '@src/models/DTOs/transaction/ITransactionDTOs';
import { TransactionType } from '@src/models/enumerators/TransactionEnum';
import { AccountEntity, TransactionEntity } from '@src/shared/db/entities';
import { IAccountRepository } from '@src/shared/db/repositories/interfaces/account';
import { typeormDataSource } from '@src/shared/db/typeorm/data-source';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import TYPES from '@src/utils/types';

import { IWithdrawUseCase, IWithdrawUseCaseRequest } from './withdraw.interface';

@injectable()
export class WithdrawUseCase implements IWithdrawUseCase {
  constructor(@inject(TYPES.AccountRepository) private readonly accountRepository: IAccountRepository) {}

  async execute({ session, amount }: IWithdrawUseCaseRequest): Promise<ITransactionDTO> {
    const account = await this.accountRepository.findByAccountId(session.userId);

    if (!account) throw new BusinessError(BusinessErrorCodes.ACCOUNT_NOT_FOUND);

    if (parseFloat(account.balance.toString()) < amount)
      throw new BusinessError(BusinessErrorCodes.INSUFFICIENT_BALANCE);

    const transaction: TransactionEntity = {
      amount,
      type: TransactionType.WITHDRAW,
      sourceId: account.id,
      destinationId: account.id,
      createdAt: DateTime.utc().toJSDate(),
    };

    const queryRunner = typeormDataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      account.balance = parseFloat(account.balance.toString()) - parseFloat(amount.toString());

      await queryRunner.manager.save(AccountEntity, account);
      await queryRunner.manager.save(TransactionEntity, transaction);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return transaction as ITransactionDTO;
  }
}
