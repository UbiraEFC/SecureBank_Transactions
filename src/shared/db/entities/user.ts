import { Column, Entity, OneToOne, Relation } from 'typeorm';

import { UserType } from '@src/models/enumerators/UsersEnum';

import AccountEntity from './account';
import Base from './base';

@Entity('user')
export default class UserEntity extends Base {
  @Column({ type: 'varchar' })
  public name?: string;

  @Column({ type: 'varchar' })
  public email?: string;

  @Column({ type: 'varchar' })
  public document?: string;

  @Column({ type: 'varchar' })
  public userType?: UserType;

  @Column({ type: 'varchar' })
  public password?: string;

  @OneToOne(() => AccountEntity, (account) => account.user)
  account?: Relation<AccountEntity>;
}
