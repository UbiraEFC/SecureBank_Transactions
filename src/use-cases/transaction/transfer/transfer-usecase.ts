import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';

import { ITransactionDTO } from '@src/models/DTOs/transaction/ITransactionDTOs';
import { TransactionType } from '@src/models/enumerators/TransactionEnum';
import { AccountEntity, TransactionEntity } from '@src/shared/db/entities';
import { IAccountRepository } from '@src/shared/db/repositories/interfaces/account';
import { typeormDataSource } from '@src/shared/db/typeorm/data-source';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import TYPES from '@src/utils/types';

import { ITransferUseCase, ITransferUseCaseRequest } from './transfer.interface';

@injectable()
export class TransferUseCase implements ITransferUseCase {
  constructor(@inject(TYPES.AccountRepository) private readonly accountRepository: IAccountRepository) {}

  async execute({ session, destinationId, amount }: ITransferUseCaseRequest): Promise<ITransactionDTO> {
    if (session.userId === destinationId)
      throw new BusinessError(BusinessErrorCodes.SOURCE_AND_DESTINATION_ACCOUNT_ARE_THE_SAME);

    const account = await this.accountRepository.findByUserId(session.userId);

    if (!account) throw new BusinessError(BusinessErrorCodes.ACCOUNT_NOT_FOUND);

    const destinationAccount = await this.accountRepository.findByAccountId(destinationId);

    if (!destinationAccount) throw new BusinessError(BusinessErrorCodes.DESTINATION_ACCOUNT_NOT_FOUND);

    if (parseFloat(account.balance.toString()) < amount)
      throw new BusinessError(BusinessErrorCodes.INSUFFICIENT_BALANCE);

    const transaction: TransactionEntity = {
      amount,
      type: TransactionType.TRANSFER,
      sourceId: account.id,
      destinationId,
      createdAt: DateTime.utc().toJSDate(),
    };

    const queryRunner = typeormDataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      account.balance = parseFloat(account.balance.toString()) - parseFloat(amount.toString());
      destinationAccount.balance = parseFloat(destinationAccount.balance.toString()) + parseFloat(amount.toString());

      await queryRunner.manager.save(AccountEntity, account);
      await queryRunner.manager.save(AccountEntity, destinationAccount);
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
