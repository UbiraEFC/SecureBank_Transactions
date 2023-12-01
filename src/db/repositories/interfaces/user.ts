import UserEntity from '@src/db/entities/user';

export interface IUserRepository {
  createOrUpdate(user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<UserEntity | undefined>;
  findByEmail(email: string): Promise<UserEntity | undefined>;
  selectByEmailOrDocument(email: string, document: string): Promise<UserEntity>;
}
