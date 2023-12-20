import { ISession } from '@src/models/DTOs/session/ISession';
import { ITransactionDTO } from '@src/models/DTOs/transaction/ITransactionDTOs';

export interface IDepositUseCaseRequest {
  session: ISession;
  amount: number;
}

export interface IDepositUseCase {
  execute(request: IDepositUseCaseRequest): Promise<ITransactionDTO>;
}
