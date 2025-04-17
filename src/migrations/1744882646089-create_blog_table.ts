import { DATABASE_NAME } from 'src/common/const/database-name';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateBlogTable1744882646089 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DATABASE_NAME.BLOG,
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
            type: 'bigint',
            name: 'user_id',
            unsigned: true,
            isNullable: false,
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
          {
            type: 'varchar',
            name: 'text',
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

    await queryRunner.createForeignKey(
      DATABASE_NAME.BLOG,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: DATABASE_NAME.USER,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      DATABASE_NAME.BLOG,
      new TableIndex({
        name: 'IDX_USER_ID',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(DATABASE_NAME.BLOG);

    if (!table) {
      return;
    }

    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey(DATABASE_NAME.BLOG, foreignKey);
    }

    await queryRunner.dropTable(DATABASE_NAME.BLOG);
  }
}
