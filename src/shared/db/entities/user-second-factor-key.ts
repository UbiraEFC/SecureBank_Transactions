import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import Base from './base';
import UserEntity from './user';

@Entity('user-second-factor-key')
export default class UserSecondFactorKeyEntity extends Base {
  @PrimaryColumn({ type: 'uuid' })
  public userId?: string;

  @Column({ type: 'boolean', default: false })
  public validated?: boolean;

  @Column({ type: 'varchar' })
  public key?: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  public user?: UserEntity;
}
