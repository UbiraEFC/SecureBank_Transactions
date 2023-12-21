export interface IHandshakeUseCaseRequest {
  frontendPublicKey: string;
}

export interface IHandshakeUseCaseResponse {
  backendPublicKey: string;
}

export interface IHandshakeUseCase {
  execute(request: IHandshakeUseCaseRequest): Promise<IHandshakeUseCaseResponse>;
}
