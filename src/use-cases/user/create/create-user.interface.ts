import { IGetUserDTO } from '@src/models/DTOs/user/IUserDTOs';
import { UserType } from '@src/models/enumerators/UsersEnum';

import { IGenerate2FAQrCodeKeyResponse } from '../generate-2fa-qrcode-key/generate-2fa-qrcode-key.interface';

export interface ICreateUserRequest {
  name: string;
  email: string;
  userType: UserType;
  document: string;
  password: string;
}

export interface ICreateUserResponse {
  user: IGetUserDTO;
  totpQrcode: IGenerate2FAQrCodeKeyResponse;
}

export interface ICreateUserUseCase {
  execute(request: ICreateUserRequest): Promise<ICreateUserResponse>;
}
