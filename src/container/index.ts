import { Container } from 'inversify';

import { IUserRepository } from '@src/db/repositories/interfaces/user';
import { UserRepository } from '@src/db/repositories/user';
import { LivenessProbeUseCase } from '@src/use-cases/health/liveness-probe/liveness-probe-usecase';
import { ILivenessProbeUseCase } from '@src/use-cases/health/liveness-probe/liveness-probe.interface';
import { CreateUserUseCase } from '@src/use-cases/user/create/create-user-usecase';
import { ICreateUserUseCase } from '@src/use-cases/user/create/create-user.interface';
import { logError, logInit } from '@src/utils/logs';
import TYPES from '@src/utils/types';

export const containerBind = (container: Container): void => {
  try {
    container.bind<ILivenessProbeUseCase>(TYPES.LivenessProbeUseCase).to(LivenessProbeUseCase);
    container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
    container.bind<ICreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
  } catch (error) {
    logError('bindDependencies', 'Server error while binding dependencies');
  }
  logInit('Server configured dependencies');
};
