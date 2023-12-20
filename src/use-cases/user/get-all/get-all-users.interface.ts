import { IGetUserDTO } from '@src/models/DTOs/user/IUserDTOs';

export interface IGetAllUsersUseCase {
  execute(): Promise<IGetUserDTO[]>;
}
