import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, interfaces } from 'inversify-express-utils';

import { CreateUserInput } from '@src/models/validations/user';
import { ICreateUserUseCase } from '@src/use-cases/user/create/create-user.interface';
import TYPES from '@src/utils/types';

import schemaCheck from './middlewares/schemaCheck';
import schemaValidate from './middlewares/schemaValidate';

@controller('/user')
export class UserController extends BaseHttpController implements interfaces.Controller {
  constructor(@inject(TYPES.CreateUserUseCase) private readonly createUserUseCase: ICreateUserUseCase) {
    super();
  }

  @httpPost('/create', schemaCheck(CreateUserInput), schemaValidate())
  public async status(req: Request, res: Response): Promise<Response> {
    const response = await this.createUserUseCase.execute({ ...req.body });

    return res.status(httpStatus.OK).json(response);
  }
}
