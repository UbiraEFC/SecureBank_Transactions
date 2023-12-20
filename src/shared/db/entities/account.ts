import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Base, UserEntity } from '.';

@Entity('account')
export default class AccountEntity extends Base {
  @PrimaryColumn({ type: 'uuid' })
  public userId?: string;

  @Column({ type: 'int' })
  public accountNumber?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  public balance?: number;

  @OneToOne(() => UserEntity, (user) => user.account)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user?: UserEntity;
}
