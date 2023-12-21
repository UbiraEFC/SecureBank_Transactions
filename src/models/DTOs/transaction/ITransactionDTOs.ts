import { TransactionType } from '@src/models/enumerators/TransactionEnum';

export interface ITransactionDTO {
  amount: number;
  type: TransactionType;
  createdAt: Date;
  sourceId: string;
  destinationId?: string;
}
