import { injectable } from 'inversify';
import { DateTime } from 'luxon';

import ConstantsEnv from '@src/config/env/constants';

import { ILivenessProbeUseCase, ILivenessProbeUseCaseResponse } from './liveness-probe.interface';

@injectable()
export class LivenessProbeUseCase implements ILivenessProbeUseCase {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  async execute(): Promise<ILivenessProbeUseCaseResponse> {
    return {
      app: ConstantsEnv.appName,
      now: DateTime.local().toISO(),
    };
  }
}
