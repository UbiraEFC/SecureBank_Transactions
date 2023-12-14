const TYPES = {
  // Providers
  OneTimePasswordProvider: 'OneTimePasswordProvider',
  StorageProvider: 'StorageProvider',

  // Health
  LivenessProbeUseCase: 'LivenessProbeUseCase',

  // User
  UserRepository: 'UserRepository',
  CreateUserUseCase: 'CreateUserUseCase',
  UserSecondFactorKeyRepository: 'UserSecondFactorKeyRepository',
  UserTokenRepository: 'UserTokenRepository',

  // 2FA
  Generate2FAQrCodeKeyUseCase: 'Generate2FAQrCodeKeyUseCase',
  Validate2FAQrCodeKeyUseCase: 'Validate2FAQrCodeKeyUseCase',

  // Session
  ValidateCredentialsUseCase: 'ValidateCredentialsUseCase',
  Validate2FAUseCase: 'Validate2FAUseCase',
  RefreshTokenUseCase: 'RefreshTokenUseCase',
};

export default TYPES;
