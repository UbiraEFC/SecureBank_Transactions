import UserEntity from '@src/db/entities/user';

import { IGetUserDTO } from './IUserDTOs';

export function getUserMapper(user: UserEntity): IGetUserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    document: user.document,
    userType: user.userType,
    createdAt: user.createdAt,
  };
}
