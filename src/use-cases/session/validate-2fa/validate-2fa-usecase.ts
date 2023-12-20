import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
import { DateTime } from 'luxon';

import ConstantsEnv from '@src/config/env/constants';
import { getUserMapper } from '@src/models/DTOs/user/userMappers';
import { TokenType } from '@src/models/enumerators/TokensEnum';
import { IUserRepository } from '@src/shared/db/repositories/interfaces/user';
import { IUserSecondFactorKeyRepository } from '@src/shared/db/repositories/interfaces/user-second-factor-key';
import { IUserTokenRepository } from '@src/shared/db/repositories/interfaces/user-token';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import { IOneTimePasswordProvider } from '@src/shared/providers/otp/interfaces/one-time-password.interface';
import TYPES from '@src/utils/types';

import { IValidate2FARequest, IValidate2FAResponse, IValidate2FAUseCase } from './validate-2fa.interface';

@injectable()
export class Validate2FAUseCase implements IValidate2FAUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.UserTokenRepository) private readonly userTokenRepository: IUserTokenRepository,
    @inject(TYPES.UserSecondFactorKeyRepository)
    private readonly userSecondFactorKeyRepository: IUserSecondFactorKeyRepository,
    @inject(TYPES.OneTimePasswordProvider) private readonly oneTimePasswordProvider: IOneTimePasswordProvider,
  ) {}

  async execute({ totpCode, temporaryToken }: IValidate2FARequest): Promise<IValidate2FAResponse> {
    const userToken = await this.userTokenRepository.findByTokenAndTokenType(
      temporaryToken,
      TokenType.AUTHENTICATION_TOKEN,
    );

    if (!userToken) throw new BusinessError(BusinessErrorCodes.TEMPORARY_TOKEN_NOT_FOUND);

    const userSecondFactorKey = await this.userSecondFactorKeyRepository.findByUserId(userToken.userId, true);

    if (!userSecondFactorKey) throw new BusinessError(BusinessErrorCodes.USER_SECOND_FACTOR_KEY_NOT_FOUND);

    const isValid = this.oneTimePasswordProvider.verifyToken(totpCode, userSecondFactorKey.key);

    if (!isValid) throw new BusinessError(BusinessErrorCodes.INVALID_TOTP_CODE);

    const user = await this.userRepository.findById(userToken.userId);

    if (!user) throw new BusinessError(BusinessErrorCodes.USER_NOT_FOUND);

    const acessToken = sign(
      {
        userType: user.userType,
      },
      ConstantsEnv.jwtSecretToken,
      {
        subject: user.id,
        expiresIn: `${ConstantsEnv.tokenExpirationInMinutes}m`,
      },
    );

    const refreshToken = sign(
      {
        userType: user.userType,
      },
      ConstantsEnv.jwtSecretRefreshToken,
      {
        subject: user.id,
        expiresIn: ConstantsEnv.refreshTokenExpirationInHours,
      },
    );

    const userTokenRefresh = await this.userTokenRepository.findByUserIdAndTokenType(user.id, TokenType.REFRESH_TOKEN);

    await this.userTokenRepository.createOrUpdate({
      id: userTokenRefresh?.id,
      userId: user.id,
      tokenType: TokenType.REFRESH_TOKEN,
      token: refreshToken,
      expiresAt: DateTime.now()
        .plus({ days: Number(ConstantsEnv.refreshTokenExpirationInDays.split('')[0]) })
        .toJSDate(),
    });

    return {
      acessToken,
      refreshToken,
      user: getUserMapper(user),
    };
  }
}
