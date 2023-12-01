import { Column, Entity } from 'typeorm';

import { UserType } from '@src/models/enumerators/UsersEnum';

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

  // SHADOW PROPERTIES
  public password?: string;
}
