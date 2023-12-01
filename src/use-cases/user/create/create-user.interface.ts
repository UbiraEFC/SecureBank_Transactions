import { IGetUserDTO } from '@src/models/DTOs/user/IUserDTOs';
import { UserType } from '@src/models/enumerators/UsersEnum';

export interface ICreateUserRequest {
  name: string;
  email: string;
  userType: UserType;
  document: string;
}

export interface ICreateUserUseCase {
  execute(request: ICreateUserRequest): Promise<IGetUserDTO>;
}
