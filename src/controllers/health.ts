import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, interfaces } from 'inversify-express-utils';

import { ILivenessProbeUseCase } from '@src/use-cases/health/liveness-probe/liveness-probe.interface';
import TYPES from '@src/utils/types';

@controller('/health')
export class HealthController extends BaseHttpController implements interfaces.Controller {
  constructor(@inject(TYPES.LivenessProbeUseCase) private readonly livenessProbeUseCase: ILivenessProbeUseCase) {
    super();
  }

  @httpGet('/liveness-probe')
  public async status(req: Request, res: Response): Promise<Response> {
    const response = await this.livenessProbeUseCase.execute();

    return res.status(httpStatus.OK).json(response);
  }
}
