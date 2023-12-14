import { Container } from 'inversify';

import { IUserSecondFactorKeyRepository } from '@src/shared/db/repositories/interfaces/user-second-factor-key';
import { IUserTokenRepository } from '@src/shared/db/repositories/interfaces/user-token';
import { UserSecondFactorKeyRepository } from '@src/shared/db/repositories/user-second-factor-key';
import { UserTokenRepository } from '@src/shared/db/repositories/user-token';
import { OTPLibProvider } from '@src/shared/providers/otp/implementations/otplib/otplib.provider';
import { IOneTimePasswordProvider } from '@src/shared/providers/otp/interfaces/one-time-password.interface';
import { LocalStorageProvider } from '@src/shared/providers/storage/implementations/local-storage/local-storage.provider';
import { IStorageProvider } from '@src/shared/providers/storage/interfaces/storage.interface';
import { LivenessProbeUseCase } from '@src/use-cases/health/liveness-probe/liveness-probe-usecase';
import { ILivenessProbeUseCase } from '@src/use-cases/health/liveness-probe/liveness-probe.interface';
import { RefreshTokenUseCase } from '@src/use-cases/session/refresh-token/refresh-token-usecase';
import { IRefreshTokenUseCase } from '@src/use-cases/session/refresh-token/refresh-token.interface';
import { Validate2FAUseCase } from '@src/use-cases/session/validate-2fa/validate-2fa-usecase';
import { IValidate2FAUseCase } from '@src/use-cases/session/validate-2fa/validate-2fa.interface';
import { ValidateCredentialsUseCase } from '@src/use-cases/session/validate-credentials/validate-credentials-usecase';
import { IValidateCredentialsUseCase } from '@src/use-cases/session/validate-credentials/validate-credentials.interface';
import { CreateUserUseCase } from '@src/use-cases/user/create/create-user-usecase';
import { ICreateUserUseCase } from '@src/use-cases/user/create/create-user.interface';
import { Generate2FAQrCodeKeyUseCase } from '@src/use-cases/user/generate-2fa-qrcode-key/generate-2fa-qrcode-key-usecase';
import { IGenerate2FAQrCodeKeyUseCase } from '@src/use-cases/user/generate-2fa-qrcode-key/generate-2fa-qrcode-key.interface';
import { Validate2FAQrCodeKeyUseCase } from '@src/use-cases/user/validate-2fa-qrcode-key/validate-2fa-qrcode-key-usecase';
import { IValidate2FAQrCodeKeyUseCase } from '@src/use-cases/user/validate-2fa-qrcode-key/validate-2fa-qrcode-key.interface';
import { logError, logInit } from '@src/utils/logs';
import TYPES from '@src/utils/types';

import { IUserRepository } from '../shared/db/repositories/interfaces/user';
import { UserRepository } from '../shared/db/repositories/user';

export const containerBind = (container: Container): void => {
  try {
    // Repositories
    container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
    container.bind<IUserTokenRepository>(TYPES.UserTokenRepository).to(UserTokenRepository);
    container
      .bind<IUserSecondFactorKeyRepository>(TYPES.UserSecondFactorKeyRepository)
      .to(UserSecondFactorKeyRepository);

    // Use Cases
    container.bind<ILivenessProbeUseCase>(TYPES.LivenessProbeUseCase).to(LivenessProbeUseCase);
    container.bind<ICreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
    container.bind<IGenerate2FAQrCodeKeyUseCase>(TYPES.Generate2FAQrCodeKeyUseCase).to(Generate2FAQrCodeKeyUseCase);
    container.bind<IValidate2FAQrCodeKeyUseCase>(TYPES.Validate2FAQrCodeKeyUseCase).to(Validate2FAQrCodeKeyUseCase);
    container.bind<IValidateCredentialsUseCase>(TYPES.ValidateCredentialsUseCase).to(ValidateCredentialsUseCase);
    container.bind<IValidate2FAUseCase>(TYPES.Validate2FAUseCase).to(Validate2FAUseCase);
    container.bind<IRefreshTokenUseCase>(TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase);

    // Providers
    container.bind<IOneTimePasswordProvider>(TYPES.OneTimePasswordProvider).to(OTPLibProvider);
    container.bind<IStorageProvider>(TYPES.StorageProvider).to(LocalStorageProvider);
  } catch (error) {
    logError('bindDependencies', 'Server error while binding dependencies');
  }
  logInit('Server configured dependencies');
};
