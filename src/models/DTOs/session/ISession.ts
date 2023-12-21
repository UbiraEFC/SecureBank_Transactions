import { UserType } from '@src/models/enumerators/UsersEnum';

export interface ISession {
  userId?: string;
  accessToken?: string;
  userType?: UserType;
}
