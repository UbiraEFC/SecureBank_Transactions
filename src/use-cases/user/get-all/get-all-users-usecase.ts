import { inject, injectable } from 'inversify';

import { IGetUserDTO } from '@src/models/DTOs/user/IUserDTOs';
import { getUserMapper } from '@src/models/DTOs/user/userMappers';
import { IUserRepository } from '@src/shared/db/repositories/interfaces/user';
import TYPES from '@src/utils/types';

import { IGetAllUsersUseCase } from './get-all-users.interface';

@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

  async execute(): Promise<IGetUserDTO[]> {
    const users = await this.userRepository.findMany();

    return users.map(getUserMapper);
  }
}
