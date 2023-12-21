export interface IGenerate2FAQrCodeKeyRequest {
  email: string;
  password: string;
}

export interface IGenerate2FAQrCodeKeyResponse {
  qrCodeUrl: string;
}

export interface IGenerate2FAQrCodeKeyUseCase {
  execute(request: IGenerate2FAQrCodeKeyRequest): Promise<IGenerate2FAQrCodeKeyResponse>;
}
