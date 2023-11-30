export interface ILivenessProbeUseCaseResponse {
  app: string;
  now: string;
}

export interface ILivenessProbeUseCase {
  execute(): Promise<ILivenessProbeUseCaseResponse>;
}
