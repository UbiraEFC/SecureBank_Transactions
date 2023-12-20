import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, interfaces } from 'inversify-express-utils';

import { IDepositUseCase } from '@src/use-cases/transaction/deposit/deposit.interface';
import { ITransferUseCase } from '@src/use-cases/transaction/transfer/transfer.interface';
import { IWithdrawUseCase } from '@src/use-cases/transaction/withdraw/withdraw.interface';
import TYPES from '@src/utils/types';

import { ensureAuthenticated } from './middlewares/ensureAuthenticated';

@controller('/transaction')
export class TransactionController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(TYPES.DepositUseCase) private readonly depositUseCase: IDepositUseCase,
    @inject(TYPES.TransferUseCase) private readonly transferUseCase: ITransferUseCase,
    @inject(TYPES.WithdrawUseCase) private readonly withdrawUseCase: IWithdrawUseCase,
  ) {
    super();
  }

  @httpPost('/deposit', ensureAuthenticated)
  public async deposit(req: Request, res: Response): Promise<Response> {
    const response = await this.depositUseCase.execute({ session: req.session, amount: req.body.amount as number });

    return res.status(httpStatus.CREATED).json(response);
  }

  @httpPost('/transfer', ensureAuthenticated)
  public async transfer(req: Request, res: Response): Promise<Response> {
    const response = await this.transferUseCase.execute({
      session: req.session,
      destinationId: req.body.destinationId as string,
      amount: req.body.amount as number,
    });

    return res.status(httpStatus.CREATED).json(response);
  }

  @httpPost('/withdraw', ensureAuthenticated)
  public async withdraw(req: Request, res: Response): Promise<Response> {
    const response = await this.withdrawUseCase.execute({ session: req.session, amount: req.body.amount as number });

    return res.status(httpStatus.CREATED).json(response);
  }
}
