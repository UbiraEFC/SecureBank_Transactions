import { Container } from 'inversify';

import { LivenessProbeUseCase } from '@src/use-cases/health/liveness-probe/liveness-probe-usecase';
import { ILivenessProbeUseCase } from '@src/use-cases/health/liveness-probe/liveness-probe.interface';
import { logError, logInit } from '@src/utils/logs';
import TYPES from '@src/utils/types';

export const containerBind = (container: Container): void => {
  try {
    container.bind<ILivenessProbeUseCase>(TYPES.LivenessProbeUseCase).to(LivenessProbeUseCase);
  } catch (error) {
    logError('bindDependencies', 'Server error while binding dependencies');
  }
  logInit('Server configured dependencies');
};
