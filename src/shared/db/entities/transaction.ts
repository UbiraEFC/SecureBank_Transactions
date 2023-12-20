import { Column, Entity } from 'typeorm';

import { TransactionType } from '@src/models/enumerators/TransactionEnum';

import Base from './base';

@Entity('transaction')
export default class TransactionEntity extends Base {
  @Column({ type: 'varchar' })
  public type?: TransactionType;

  @Column({ type: 'uuid' })
  public sourceId?: string;

  @Column({ type: 'uuid' })
  public destinationId?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  public amount?: number;
}
