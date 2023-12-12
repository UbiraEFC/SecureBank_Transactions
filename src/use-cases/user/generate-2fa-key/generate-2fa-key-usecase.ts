import { inject, injectable } from 'inversify';
import qrcode from 'qrcode';

import ConstantsEnv from '@src/config/env/constants';
import upload from '@src/config/upload/upload';
import { IUserRepository } from '@src/shared/db/repositories/interfaces/user';
import { IUserSecondFactorKeyRepository } from '@src/shared/db/repositories/interfaces/user-second-factor-key';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import IntegrationError from '@src/shared/errors/integration';
import { IOneTimePasswordProvider } from '@src/shared/providers/otp/interfaces/one-time-password.interface';
import { IStorageProvider } from '@src/shared/providers/storage/interfaces/storage.interface';
import { deleteFile, fileExists } from '@src/utils/file';
import TYPES from '@src/utils/types';

import { IGenerate2FAKeyRequest, IGenerate2FAKeyResponse, IGenerate2FAKeyUseCase } from './generate-2fa-key.interface';

@injectable()
export class Generate2FAKeyUseCase implements IGenerate2FAKeyUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.UserSecondFactorKeyRepository)
    private readonly userSecondFactorKeyRepository: IUserSecondFactorKeyRepository,
    @inject(TYPES.StorageProvider) private readonly storageProvider: IStorageProvider,
    @inject(TYPES.OneTimePasswordProvider) private readonly oneTimePasswordProvider: IOneTimePasswordProvider,
  ) {}

  async execute({ userId }: IGenerate2FAKeyRequest): Promise<IGenerate2FAKeyResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new BusinessError(BusinessErrorCodes.USER_NOT_FOUND);

    await this.userSecondFactorKeyRepository.removeUnvalidatedKeys(userId);

    const key = this.oneTimePasswordProvider.generateBase32Key();

    await this.userSecondFactorKeyRepository.generate(userId, key);

    const fileName = `${userId}.png`;
    const fileDirTmp = `${upload.tmpFolder}/${fileName}`;
    await deleteFile(fileName);
    const keyName = 'Node 2FA';
    const uri = this.oneTimePasswordProvider.generateKeyURI(user.email, keyName, key);

    try {
      await qrcode.toFile(fileDirTmp, uri, {});
    } catch (error) {
      throw new IntegrationError('qrcode', error);
    }

    if (fileExists(fileDirTmp)) {
      await this.storageProvider.upload(fileName);
    } else {
      throw new BusinessError(BusinessErrorCodes.QRCODE_NOT_FOUND);
    }

    const qrCodeUrl = `${ConstantsEnv.apiUrl}/users/qrcode/${userId}.png`;

    return { qrCodeUrl };
  }
}
