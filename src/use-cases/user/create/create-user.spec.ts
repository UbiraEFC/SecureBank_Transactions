import { beforeEach, describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { UserType } from '@src/models/enumerators/UsersEnum';
import { IUserRepository } from '@src/shared/db/repositories/interfaces/user';

import { IGenerate2FAQrCodeKeyUseCase } from '../generate-2fa-qrcode-key/generate-2fa-qrcode-key.interface';
import { CreateUserUseCase } from './create-user-usecase';
import { ICreateUserUseCase } from './create-user.interface';

const userRepositoryMock = mock<IUserRepository>();
const Generate2FAQrCodeKeyUseCaseMock = mock<IGenerate2FAQrCodeKeyUseCase>();

let createUserUseCase: ICreateUserUseCase;

describe('Create User UseCase', () => {
  beforeEach(() => {
    createUserUseCase = new CreateUserUseCase(userRepositoryMock, Generate2FAQrCodeKeyUseCaseMock);
  });

  it('Should create a new user', async () => {
    const user = {
      id: 'id',
      name: 'User Test',
      email: 'email',
      document: 'document',
      userType: UserType.PF,
      password: 'password',
    };
    userRepositoryMock.createOrUpdate.mockResolvedValueOnce(user);

    const response = await createUserUseCase.execute({ ...user });

    expect(response).toHaveProperty('user');
  });
});
