import bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';

import ConstantsEnv from '@src/config/env/constants';
import { getUserMapper } from '@src/models/DTOs/user/userMappers';
import { AccountEntity } from '@src/shared/db/entities';
import { IAccountRepository } from '@src/shared/db/repositories/interfaces/account';
import { IUserRepository } from '@src/shared/db/repositories/interfaces/user';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import TYPES from '@src/utils/types';

import { IGenerate2FAQrCodeKeyUseCase } from '../generate-2fa-qrcode-key/generate-2fa-qrcode-key.interface';
import { ICreateUserRequest, ICreateUserResponse, ICreateUserUseCase } from './create-user.interface';

@injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.AccountRepository) private readonly accountRepository: IAccountRepository,
    @inject(TYPES.Generate2FAQrCodeKeyUseCase)
    private readonly generate2FAQrCodeKeyUseCase: IGenerate2FAQrCodeKeyUseCase,
  ) {}

  async execute({ name, email, document, userType, password }: ICreateUserRequest): Promise<ICreateUserResponse> {
    const userAlreadyExists = await this.userRepository.selectByEmailOrDocument(email, document);

    if (userAlreadyExists) throw new BusinessError(BusinessErrorCodes.USER_ALREADY_EXISTS);

    const salt = await bcrypt.genSalt(ConstantsEnv.hashSaltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      name,
      email,
      document,
      userType,
      password: hashedPassword,
    };

    const createdUser = await this.userRepository.createOrUpdate(user);

    let account: AccountEntity = {
      userId: createdUser.id,
      balance: 0,
    };

    account = await this.accountRepository.create(account);

    createdUser.account = account;

    const totpQrcode = await this.generate2FAQrCodeKeyUseCase.execute({ email, password });

    return { user: getUserMapper(createdUser), totpQrcode };
  }
}
