import { DATABASE_NAME } from 'src/common/const/database-name';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateBlogTable1744886936844 implements MigrationInterface {
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
            type: 'bigint',
            name: 'category_id',
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

    await queryRunner.createForeignKey(
      DATABASE_NAME.BLOG,
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: DATABASE_NAME.CATEGORY,
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

    await queryRunner.createIndex(
      DATABASE_NAME.BLOG,
      new TableIndex({
        name: 'IDX_CATEGORY_ID',
        columnNames: ['category_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(DATABASE_NAME.BLOG);

    if (!table) {
      return;
    }

    const foreignKeyUserId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );

    if (foreignKeyUserId) {
      await queryRunner.dropForeignKey(DATABASE_NAME.BLOG, foreignKeyUserId);
    }

    const foreignKeyCategoryId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('category_id') !== -1,
    );

    if (foreignKeyCategoryId) {
      await queryRunner.dropForeignKey(
        DATABASE_NAME.BLOG,
        foreignKeyCategoryId,
      );
    }

    await queryRunner.dropIndex(DATABASE_NAME.COMMENT, 'IDX_USER_ID');
    await queryRunner.dropIndex(DATABASE_NAME.COMMENT, 'IDX_CATEGORY_ID');

    await queryRunner.dropTable(DATABASE_NAME.BLOG);
  }
}
