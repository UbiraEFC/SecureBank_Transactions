import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, interfaces } from 'inversify-express-utils';

import { IRefreshTokenUseCase } from '@src/use-cases/session/refresh-token/refresh-token.interface';
import { IValidate2FAUseCase } from '@src/use-cases/session/validate-2fa/validate-2fa.interface';
import { IValidateCredentialsUseCase } from '@src/use-cases/session/validate-credentials/validate-credentials.interface';
import TYPES from '@src/utils/types';

@controller('/session')
export class SessionController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(TYPES.ValidateCredentialsUseCase) private readonly validateCredentialsUseCase: IValidateCredentialsUseCase,
    @inject(TYPES.Validate2FAUseCase) private readonly validate2FAUseCase: IValidate2FAUseCase,
    @inject(TYPES.RefreshTokenUseCase) private readonly refreshTokenUseCase: IRefreshTokenUseCase,
  ) {
    super();
  }

  @httpPost('/')
  public async validateCredentials(req: Request, res: Response): Promise<Response> {
    const response = await this.validateCredentialsUseCase.execute({ ...req.body });

    return res.status(httpStatus.OK).json(response);
  }

  @httpPost('/validate2fa')
  public async validate2fa(req: Request, res: Response): Promise<Response> {
    const response = await this.validate2FAUseCase.execute({ ...req.body });

    return res.status(httpStatus.OK).json(response);
  }

  @httpPost('/refresh-token')
  public async refreshToken(req: Request, res: Response): Promise<Response> {
    const response = await this.refreshTokenUseCase.execute({ ...req.body });

    return res.status(httpStatus.OK).json(response);
  }
}
