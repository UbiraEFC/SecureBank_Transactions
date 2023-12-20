import { ISession } from '@src/models/DTOs/session/ISession';
import { IGetUserDTO } from '@src/models/DTOs/user/IUserDTOs';

export interface IGetMeUseCaseRequest {
  session: ISession;
}

export interface IGetMeUseCase {
  execute(request: IGetMeUseCaseRequest): Promise<IGetUserDTO>;
}
