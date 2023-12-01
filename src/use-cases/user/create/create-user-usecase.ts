import { inject, injectable } from 'inversify';

import { IUserRepository } from '@src/db/repositories/interfaces/user';
import { IGetUserDTO } from '@src/models/DTOs/user/IUserDTOs';
import { getUserMapper } from '@src/models/DTOs/user/userMappers';
import BusinessError, { BusinessErrorCodes } from '@src/utils/errors/business';
import TYPES from '@src/utils/types';

import { ICreateUserRequest, ICreateUserUseCase } from './create-user.interface';

@injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

  async execute({ name, email, document, userType }: ICreateUserRequest): Promise<IGetUserDTO> {
    const userAlreadyExists = await this.userRepository.selectByEmailOrDocument(email, document);

    if (userAlreadyExists) throw new BusinessError(BusinessErrorCodes.USER_ALREADY_EXISTS);

    const user = {
      name,
      email,
      document,
      userType,
    };

    const createdUser = await this.userRepository.createOrUpdate(user);

    return getUserMapper(createdUser);
  }
}
