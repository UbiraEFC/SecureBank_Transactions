import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export default class Base {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  public deletedAt?: Date;
}
