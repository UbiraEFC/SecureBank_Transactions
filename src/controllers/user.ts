import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, interfaces } from 'inversify-express-utils';

import { CreateUserInput } from '@src/models/validations/user';
import { ICreateUserUseCase } from '@src/use-cases/user/create/create-user.interface';
import { IGenerate2FAQrCodeKeyUseCase } from '@src/use-cases/user/generate-2fa-qrcode-key/generate-2fa-qrcode-key.interface';
import { IValidate2FAQrCodeKeyUseCase } from '@src/use-cases/user/validate-2fa-qrcode-key/validate-2fa-qrcode-key.interface';
import TYPES from '@src/utils/types';

import schemaCheck from './middlewares/schemaCheck';
import schemaValidate from './middlewares/schemaValidate';

@controller('/user')
export class UserController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(TYPES.CreateUserUseCase) private readonly createUserUseCase: ICreateUserUseCase,
    @inject(TYPES.Generate2FAQrCodeKeyUseCase)
    private readonly Generate2FAQrCodeKeyUseCase: IGenerate2FAQrCodeKeyUseCase,
    @inject(TYPES.Validate2FAQrCodeKeyUseCase)
    private readonly Validate2FAQrCodeKeyUseCase: IValidate2FAQrCodeKeyUseCase,
  ) {
    super();
  }

  @httpPost('/register', schemaCheck(CreateUserInput), schemaValidate())
  public async status(req: Request, res: Response): Promise<Response> {
    const response = await this.createUserUseCase.execute({ ...req.body });

    return res.status(httpStatus.CREATED).json(response);
  }

  @httpPost('/generate2fa')
  public async generate2fa(req: Request, res: Response): Promise<Response> {
    const response = await this.Generate2FAQrCodeKeyUseCase.execute({ ...req.body });

    return res.status(httpStatus.OK).json(response);
  }

  @httpPost('/validate2fa')
  public async validate2fa(req: Request, res: Response): Promise<Response> {
    const response = await this.Validate2FAQrCodeKeyUseCase.execute({ ...req.body });

    return res.status(httpStatus.OK).json(response);
  }
}
