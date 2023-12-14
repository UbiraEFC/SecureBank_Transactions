export interface IValidate2FAQrCodeKeyUseCaseRequest {
  userId: string;
  totpCode: string;
}

export interface IValidate2FAQrCodeKeyUseCaseResponse {
  isValid: boolean;
}

export interface IValidate2FAQrCodeKeyUseCase {
  execute(request: IValidate2FAQrCodeKeyUseCaseRequest): Promise<IValidate2FAQrCodeKeyUseCaseResponse>;
}
