import { IGetUserDTO } from '@src/models/DTOs/user/IUserDTOs';
import { UserType } from '@src/models/enumerators/UsersEnum';
import { IGenerate2FAKeyResponse } from '@src/use-cases/user/generate-2fa-key/generate-2fa-key.interface';

export interface ICreateUserRequest {
  name: string;
  email: string;
  userType: UserType;
  document: string;
  password: string;
}

export interface ICreateUserResponse {
  user: IGetUserDTO;
  totpQrcode: IGenerate2FAKeyResponse;
}

export interface ICreateUserUseCase {
  execute(request: ICreateUserRequest): Promise<ICreateUserResponse>;
}
