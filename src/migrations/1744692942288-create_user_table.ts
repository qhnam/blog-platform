import { DATABASE_NAME } from 'src/common/const/database-name';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1744692942288 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DATABASE_NAME.USER,
        columns: [
          {
            type: 'bigint',
            name: 'id',
            isPrimary: true,
            unsigned: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            type: 'varchar',
            name: 'email',
            isNullable: false,
            isUnique: true,
            length: '255',
          },
          {
            type: 'varchar',
            name: 'password',
            length: '255',
            isNullable: false,
          },
          {
            type: 'varchar',
            name: 'salt',
            length: '64',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DATABASE_NAME.USER);
  }
}
