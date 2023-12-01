import { injectable } from 'inversify';

import UserEntity from '../entities/user';
import { typeormDataSource } from '../typeorm/data-source';
import { IUserRepository } from './interfaces/user';

@injectable()
export class UserRepository implements IUserRepository {
  private userRepository = typeormDataSource.getRepository(UserEntity);

  async createOrUpdate(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async findById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }

  async selectByEmailOrDocument(email: string, document: string): Promise<UserEntity> {
    if (email) {
      const user = this.userRepository.findOne({
        where: { email, deletedAt: null },
      });
      return user;
    }
    if (document) {
      const user = this.userRepository.findOne({
        where: { document, deletedAt: null },
      });
      return user;
    }
    return null;
  }
}
