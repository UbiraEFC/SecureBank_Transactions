const TYPES = {
  // Providers
  OneTimePasswordProvider: 'OneTimePasswordProvider',
  StorageProvider: 'StorageProvider',

  // Health
  LivenessProbeUseCase: 'LivenessProbeUseCase',

  // User
  UserRepository: 'UserRepository',
  CreateUserUseCase: 'CreateUserUseCase',
  GetMeUseCase: 'GetMeUseCase',
  GetAllUsersUseCase: 'GetAllUsersUseCase',
  UserSecondFactorKeyRepository: 'UserSecondFactorKeyRepository',
  UserTokenRepository: 'UserTokenRepository',

  // Account
  AccountRepository: 'AccountRepository',

  // Transaction
  TransactionRepository: 'TransactionRepository',
  DepositUseCase: 'DepositUseCase',
  TransferUseCase: 'TransferUseCase',
  WithdrawUseCase: 'WithdrawUseCase',

  // 2FA
  Generate2FAQrCodeKeyUseCase: 'Generate2FAQrCodeKeyUseCase',
  Validate2FAQrCodeKeyUseCase: 'Validate2FAQrCodeKeyUseCase',

  // Session
  ValidateCredentialsUseCase: 'ValidateCredentialsUseCase',
  Validate2FAUseCase: 'Validate2FAUseCase',
  RefreshTokenUseCase: 'RefreshTokenUseCase',
};

export default TYPES;
