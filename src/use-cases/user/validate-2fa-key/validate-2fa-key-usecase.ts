import { inject, injectable } from 'inversify';

import { IUserSecondFactorKeyRepository } from '@src/shared/db/repositories/interfaces/user-second-factor-key';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import { IOneTimePasswordProvider } from '@src/shared/providers/otp/interfaces/one-time-password.interface';
import TYPES from '@src/utils/types';

import {
  IValidate2FAKeyUseCase,
  IValidate2FAKeyUseCaseRequest,
  IValidate2FAKeyUseCaseResponse,
} from './validate-2fa-key.interface';

@injectable()
export class Validate2FAKeyUseCase implements IValidate2FAKeyUseCase {
  constructor(
    @inject(TYPES.UserSecondFactorKeyRepository)
    private readonly userSecondFactorKeyRepository: IUserSecondFactorKeyRepository,
    @inject(TYPES.OneTimePasswordProvider) private readonly oneTimePasswordProvider: IOneTimePasswordProvider,
  ) {}

  async execute({ userId, totpCode }: IValidate2FAKeyUseCaseRequest): Promise<IValidate2FAKeyUseCaseResponse> {
    const userSecondFactorKey = await this.userSecondFactorKeyRepository.findByUserId(userId, false);

    if (!userSecondFactorKey) throw new BusinessError(BusinessErrorCodes.USER_SECOND_FACTOR_KEY_NOT_FOUND);

    const isValid = this.oneTimePasswordProvider.verifyToken(totpCode, userSecondFactorKey.key);

    if (!isValid) throw new BusinessError(BusinessErrorCodes.INVALID_TOTP_CODE);

    await this.userSecondFactorKeyRepository.changeValidKey(userId);

    return { isValid };
  }
}
