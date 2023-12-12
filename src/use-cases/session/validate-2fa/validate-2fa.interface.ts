import { IGetUserDTO } from '@src/models/DTOs/user/IUserDTOs';

export interface IValidate2FARequest {
  totpCode: string;
  temporaryToken: string;
}

export interface IValidate2FAResponse {
  acessToken: string;
  refreshToken: string;
  user: IGetUserDTO;
}

export interface IValidate2FAUseCase {
  execute(request: IValidate2FARequest): Promise<IValidate2FAResponse>;
}
