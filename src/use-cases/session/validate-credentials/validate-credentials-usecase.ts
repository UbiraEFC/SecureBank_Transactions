import bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import { v4 as uuidV4 } from 'uuid';

import ConstantsEnv from '@src/config/env/constants';
import { TokenType } from '@src/models/enumerators/TokensEnum';
import { IUserRepository } from '@src/shared/db/repositories/interfaces/user';
import { IUserTokenRepository } from '@src/shared/db/repositories/interfaces/user-token';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import TYPES from '@src/utils/types';

import {
  IValidateCredentialsRequest,
  IValidateCredentialsResponse,
  IValidateCredentialsUseCase,
} from './validate-credentials.interface';

@injectable()
export class ValidateCredentialsUseCase implements IValidateCredentialsUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.UserTokenRepository) private readonly userTokenRepository: IUserTokenRepository,
  ) {}

  async execute({ email, password }: IValidateCredentialsRequest): Promise<IValidateCredentialsResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new BusinessError(BusinessErrorCodes.USER_NOT_FOUND);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new BusinessError(BusinessErrorCodes.INVALID_PASSWORD);

    const temporaryToken = uuidV4();

    const userToken = await this.userTokenRepository.findByUserIdAndTokenType(user.id, TokenType.AUTHENTICATION_TOKEN);

    await this.userTokenRepository.createOrUpdate({
      id: userToken?.id,
      userId: user.id,
      tokenType: TokenType.AUTHENTICATION_TOKEN,
      token: temporaryToken,
      expiresAt: DateTime.now().plus({ minutes: ConstantsEnv.tokenExpirationInMinutes }).toJSDate(),
    });

    return { temporaryToken, expiresInMinutes: ConstantsEnv.tokenExpirationInMinutes };
  }
}
