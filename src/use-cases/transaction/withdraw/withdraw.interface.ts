import { ISession } from '@src/models/DTOs/session/ISession';
import { ITransactionDTO } from '@src/models/DTOs/transaction/ITransactionDTOs';

export interface IWithdrawUseCaseRequest {
  session: ISession;
  amount: number;
}

export interface IWithdrawUseCase {
  execute(request: IWithdrawUseCaseRequest): Promise<ITransactionDTO>;
}
