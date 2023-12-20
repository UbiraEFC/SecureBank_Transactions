import { injectable } from 'inversify';

import { TransactionEntity } from '../entities';
import { typeormDataSource } from '../typeorm/data-source';
import { ITransactionRepository } from './interfaces/transaction';

@injectable()
export class TransactionRepository implements ITransactionRepository {
  private transactionRepository = typeormDataSource.getRepository(TransactionEntity);

  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    return this.transactionRepository.save(transaction);
  }

  async findBySourceId(sourceId: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({ where: { sourceId } });
  }

  async findByDestinationId(destinationId: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({ where: { destinationId } });
  }
}
