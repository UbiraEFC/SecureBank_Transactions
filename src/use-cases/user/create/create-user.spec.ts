import { beforeEach, describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { IUserRepository } from '@src/db/repositories/interfaces/user';
import { UserType } from '@src/models/enumerators/UsersEnum';

import { CreateUserUseCase } from './create-user-usecase';
import { ICreateUserUseCase } from './create-user.interface';

const userRepositoryMock = mock<IUserRepository>();

let createUserUseCase: ICreateUserUseCase;

describe('Create User UseCase', () => {
  beforeEach(() => {
    createUserUseCase = new CreateUserUseCase(userRepositoryMock);
  });

  it('Should create a new user', async () => {
    const user = {
      id: 'id',
      name: 'User Test',
      email: 'email',
      document: 'document',
      userType: UserType.PF,
    };
    userRepositoryMock.createOrUpdate.mockResolvedValueOnce(user);

    const response = await createUserUseCase.execute({ ...user });

    expect(response).toHaveProperty('id');
  });
});
