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
  Generate2FAKeyUseCase: 'Generate2FAKeyUseCase',
  Validate2FAKeyUseCase: 'Validate2FAKeyUseCase',

  // Session
  ValidateCredentialsUseCase: 'ValidateCredentialsUseCase',
  Validate2FAUseCase: 'Validate2FAUseCase',
  RefreshTokenUseCase: 'RefreshTokenUseCase',
};

export default TYPES;
