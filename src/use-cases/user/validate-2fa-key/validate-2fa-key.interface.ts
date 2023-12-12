export interface IValidate2FAKeyUseCaseRequest {
  userId: string;
  totpCode: string;
}

export interface IValidate2FAKeyUseCaseResponse {
  isValid: boolean;
}

export interface IValidate2FAKeyUseCase {
  execute(request: IValidate2FAKeyUseCaseRequest): Promise<IValidate2FAKeyUseCaseResponse>;
}
