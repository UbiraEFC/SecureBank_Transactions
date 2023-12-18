import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUserSecondFactorKey1702385554595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user-second-factor-key',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'validated',
            type: 'boolean',
            isNullable: false,
            default: false,
            isPrimary: true,
          },
          {
            name: 'key',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_USER_SECOND_FACTOR_KEY',
            columnNames: ['userId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user-second-factor-key');
  }
}
