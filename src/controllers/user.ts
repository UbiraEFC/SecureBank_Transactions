import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';

import { UserType } from '@src/models/enumerators/UsersEnum';
import { CreateUserInput } from '@src/models/validations/user';
import { ICreateUserUseCase } from '@src/use-cases/user/create/create-user.interface';
import { IGenerate2FAQrCodeKeyUseCase } from '@src/use-cases/user/generate-2fa-qrcode-key/generate-2fa-qrcode-key.interface';
import { IGetAllUsersUseCase } from '@src/use-cases/user/get-all/get-all-users.interface';
import { IGetMeUseCase } from '@src/use-cases/user/get-me/get-me.interface';
import { IValidate2FAQrCodeKeyUseCase } from '@src/use-cases/user/validate-2fa-qrcode-key/validate-2fa-qrcode-key.interface';
import TYPES from '@src/utils/types';

import { ensureAuthenticated } from './middlewares/ensureAuthenticated';
import { hasAccess } from './middlewares/hasAccess';
import schemaCheck from './middlewares/schemaCheck';
import schemaValidate from './middlewares/schemaValidate';

@controller('/user')
export class UserController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(TYPES.CreateUserUseCase) private readonly createUserUseCase: ICreateUserUseCase,
    @inject(TYPES.GetMeUseCase) private readonly getMeUseCase: IGetMeUseCase,
    @inject(TYPES.GetAllUsersUseCase) private readonly getAllUsersUseCase: IGetAllUsersUseCase,
    @inject(TYPES.Generate2FAQrCodeKeyUseCase)
    private readonly Generate2FAQrCodeKeyUseCase: IGenerate2FAQrCodeKeyUseCase,
    @inject(TYPES.Validate2FAQrCodeKeyUseCase)
    private readonly Validate2FAQrCodeKeyUseCase: IValidate2FAQrCodeKeyUseCase,
  ) {
    super();
  }

  @httpGet('/', ensureAuthenticated, hasAccess([UserType.ADMIN]))
  public async getAll(req: Request, res: Response): Promise<Response> {
    const response = await this.getAllUsersUseCase.execute();

    return res.status(httpStatus.OK).json(response);
  }

  @httpGet('/me', ensureAuthenticated)
  public async getMe(req: Request, res: Response): Promise<Response> {
    const response = await this.getMeUseCase.execute({ session: req.session });

    return res.status(httpStatus.OK).json(response);
  }

  @httpPost('/register', schemaCheck(CreateUserInput), schemaValidate())
  public async status(req: Request, res: Response): Promise<Response> {
    const response = await this.createUserUseCase.execute({ ...req.body });

    return res.status(httpStatus.CREATED).json(response);
  }

  @httpPost('/generate2fa-key')
  public async generate2fa(req: Request, res: Response): Promise<Response> {
    const response = await this.Generate2FAQrCodeKeyUseCase.execute({ ...req.body });

    return res.status(httpStatus.OK).json(response);
  }

  @httpPost('/validate2fa-key')
  public async validate2fa(req: Request, res: Response): Promise<Response> {
    const response = await this.Validate2FAQrCodeKeyUseCase.execute({ ...req.body });

    return res.status(httpStatus.OK).json(response);
  }
}
