import bcrypt from 'bcryptjs';
import { DateTime } from 'luxon';
import { MigrationInterface, QueryRunner } from 'typeorm';

import ConstantsEnv from '@src/config/env/constants';
import { UserType } from '@src/models/enumerators/UsersEnum';

import { UserEntity } from '../../entities';
import { typeormDataSource } from '../data-source';

const userRepository = typeormDataSource.getRepository(UserEntity);

export class SeedAdminCreation1702933736827 implements MigrationInterface {
  public async up(): Promise<void> {
    const admin = await userRepository.findOne({ where: { email: process.env.ADMIN_EMAIL } });

    if (!admin) {
      const salt = await bcrypt.genSalt(ConstantsEnv.hashSaltRounds);

      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

      await userRepository.save({
        name: 'Admin Secure Bank',
        email: process.env.ADMIN_EMAIL,
        document: '00000000000',
        password: hashedPassword,
        userType: UserType.ADMIN,
        createdAt: DateTime.now().toJSDate(),
        updatedAt: DateTime.now().toJSDate(),
      });
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable('user');
  }
}
