import { DATABASE_NAME } from 'src/common/const/database-name';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoryTable1744883413822 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DATABASE_NAME.CATEGORY,
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
            length: '255',
            name: 'title',
            isNullable: false,
          },
          {
            type: 'varchar',
            length: '255',
            name: 'slug',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DATABASE_NAME.CATEGORY);
  }
}
