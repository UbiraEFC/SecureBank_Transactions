import bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';

import ConstantsEnv from '@src/config/env/constants';
import { getUserMapper } from '@src/models/DTOs/user/userMappers';
import { IUserRepository } from '@src/shared/db/repositories/interfaces/user';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';
import TYPES from '@src/utils/types';

import { IGenerate2FAQrCodeKeyUseCase } from '../generate-2fa-qrcode-key/generate-2fa-qrcode-key.interface';
import { ICreateUserRequest, ICreateUserResponse, ICreateUserUseCase } from './create-user.interface';

@injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.Generate2FAQrCodeKeyUseCase)
    private readonly Generate2FAQrCodeKeyUseCase: IGenerate2FAQrCodeKeyUseCase,
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

    const totpQrcode = await this.Generate2FAQrCodeKeyUseCase.execute({ userId: createdUser.id });

    return { user: getUserMapper(createdUser), totpQrcode };
  }
}
