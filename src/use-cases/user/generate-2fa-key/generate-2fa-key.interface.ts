export interface IGenerate2FAKeyRequest {
  userId: string;
}

export interface IGenerate2FAKeyResponse {
  qrCodeUrl: string;
}

export interface IGenerate2FAKeyUseCase {
  execute(request: IGenerate2FAKeyRequest): Promise<IGenerate2FAKeyResponse>;
}
