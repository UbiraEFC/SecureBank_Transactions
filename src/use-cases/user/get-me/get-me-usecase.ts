import { inject, injectable } from 'inversify';

import { IGetUserDTO } from '@src/models/DTOs/user/IUserDTOs';
import { getUserMapper } from '@src/models/DTOs/user/userMappers';
import { IUserRepository } from '@src/shared/db/repositories/interfaces/user';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import TYPES from '@src/utils/types';

import { IGetMeUseCase, IGetMeUseCaseRequest } from './get-me.interface';

@injectable()
export class GetMeUseCase implements IGetMeUseCase {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

  async execute({ session }: IGetMeUseCaseRequest): Promise<IGetUserDTO> {
    const user = await this.userRepository.findById(session.userId);

    if (!user) throw new BusinessError(BusinessErrorCodes.USER_NOT_FOUND);

    return getUserMapper(user);
  }
}
