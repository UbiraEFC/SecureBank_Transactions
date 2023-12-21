import { TransactionEntity } from '../../entities';

export interface ITransactionRepository {
  create(transaction: TransactionEntity): Promise<TransactionEntity>;
  findBySourceId(sourceId: string): Promise<TransactionEntity[]>;
  findByDestinationId(destinationId: string): Promise<TransactionEntity[]>;
}
