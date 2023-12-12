import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TokenType } from '@src/models/enumerators/TokensEnum';

import Base from './base';
import UserEntity from './user';

@Entity('user-token')
export default class UserTokenEntity extends Base {
  @Column({ type: 'varchar' })
  public token?: string;

  @Column({ type: 'uuid' })
  public userId?: string;

  @Column({ type: 'varchar' })
  public tokenType?: TokenType;

  @Column({ type: 'timestamptz' })
  public expiresAt?: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  public user?: UserEntity;
}
