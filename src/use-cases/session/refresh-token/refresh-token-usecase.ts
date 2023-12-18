import { inject, injectable } from 'inversify';
import { sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { DateTime } from 'luxon';

import ConstantsEnv from '@src/config/env/constants';
import { TokenType } from '@src/models/enumerators/TokensEnum';
import { IUserTokenRepository } from '@src/shared/db/repositories/interfaces/user-token';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import TYPES from '@src/utils/types';

import {
  IRefreshTokenUseCase,
  IRefreshTokenUseCaseRequest,
  IRefreshTokenUseCaseResponse,
} from './refresh-token.interface';

interface IDecodedRefreshToken {
  email: string;
  sub: string;
}

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(@inject(TYPES.UserTokenRepository) private readonly userTokenRepository: IUserTokenRepository) {}

  async execute({ refreshToken }: IRefreshTokenUseCaseRequest): Promise<IRefreshTokenUseCaseResponse> {
    let decodedRefreshToken = null;

    try {
      decodedRefreshToken = verify(refreshToken, ConstantsEnv.jwtSecretRefreshToken);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BusinessError(BusinessErrorCodes.REFRESH_TOKEN_EXPIRED);
      }
      throw new BusinessError(BusinessErrorCodes.INVALID_REFRESH_TOKEN);
    }

    const { email, sub: userId } = decodedRefreshToken as IDecodedRefreshToken;

    const userToken = await this.userTokenRepository.findByUserIdAndTokenType(userId, TokenType.REFRESH_TOKEN);

    if (!userToken || userToken.token !== refreshToken)
      throw new BusinessError(BusinessErrorCodes.INVALID_REFRESH_TOKEN);

    if (userToken.expiresAt < DateTime.now().toJSDate()) {
      throw new BusinessError(BusinessErrorCodes.REFRESH_TOKEN_EXPIRED);
    }

    const token = sign({}, ConstantsEnv.jwtSecretToken, {
      subject: userId,
      expiresIn: ConstantsEnv.tokenExpirationInMinutes,
    });

    const newRefreshToken = sign({ email }, ConstantsEnv.jwtSecretRefreshToken, {
      subject: userId,
      expiresIn: ConstantsEnv.refreshTokenExpirationInHours,
    });

    await this.userTokenRepository.createOrUpdate({
      id: userToken.id,
      userId,
      tokenType: TokenType.REFRESH_TOKEN,
      token: newRefreshToken,
      expiresAt: DateTime.now().plus({ days: ConstantsEnv.refreshTokenExpirationInDays }).toJSDate(),
    });

    return { acessToken: token, refreshToken: newRefreshToken };
  }
}
