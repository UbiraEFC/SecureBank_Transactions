import { UserType } from '../../enumerators/UsersEnum';

export interface IGetUserDTO {
  id: string;
  name: string;
  email: string;
  document: string;
  userType: UserType;
  createdAt: Date;
}
