export interface IValidateCredentialsRequest {
  email: string;
  password: string;
}

export interface IValidateCredentialsResponse {
  temporaryToken: string;
  expiresInMinutes: number;
}

export interface IValidateCredentialsUseCase {
  execute(request: IValidateCredentialsRequest): Promise<IValidateCredentialsResponse>;
}
