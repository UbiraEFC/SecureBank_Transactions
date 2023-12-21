import { injectable } from 'inversify';

import ConstantsEnv from '@src/config/env/constants';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';

import { IHandshakeUseCase, IHandshakeUseCaseRequest, IHandshakeUseCaseResponse } from './handshake.interface';

@injectable()
export class HandshakeUseCase implements IHandshakeUseCase {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  async execute({ frontendPublicKey }: IHandshakeUseCaseRequest): Promise<IHandshakeUseCaseResponse> {
    if (!frontendPublicKey) throw new BusinessError(BusinessErrorCodes.MISSING_KEY);

    ConstantsEnv.frontendPublicKey = frontendPublicKey as string;

    return {
      backendPublicKey: ConstantsEnv.backendPublicKey,
    };
  }
}
