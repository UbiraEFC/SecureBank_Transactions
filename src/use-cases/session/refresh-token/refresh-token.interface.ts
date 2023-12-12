export interface IRefreshTokenUseCaseRequest {
  refreshToken: string;
}

export interface IRefreshTokenUseCaseResponse {
  acessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenUseCase {
  execute(request: IRefreshTokenUseCaseRequest): Promise<IRefreshTokenUseCaseResponse>;
}
