import { ISession } from '@src/models/DTOs/session/ISession';
import { ITransactionDTO } from '@src/models/DTOs/transaction/ITransactionDTOs';

export interface ITransferUseCaseRequest {
  session: ISession;
  destinationId: string;
  amount: number;
}

export interface ITransferUseCase {
  execute(request: ITransferUseCaseRequest): Promise<ITransactionDTO>;
}
