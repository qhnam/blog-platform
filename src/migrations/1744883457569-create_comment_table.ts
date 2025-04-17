import { DATABASE_NAME } from 'src/common/const/database-name';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateCommentTable1744883457569 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DATABASE_NAME.COMMENT,
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
            name: 'blog_id',
            unsigned: true,
            isNullable: false,
          },
          {
            type: 'bigint',
            name: 'user_id',
            unsigned: true,
            isNullable: false,
          },
          {
            type: 'varchar',
            length: '500',
            name: 'content',
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
      DATABASE_NAME.COMMENT,
      new TableForeignKey({
        columnNames: ['blog_id'],
        referencedColumnNames: ['id'],
        referencedTableName: DATABASE_NAME.BLOG,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      DATABASE_NAME.COMMENT,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: DATABASE_NAME.USER,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      DATABASE_NAME.COMMENT,
      new TableIndex({
        columnNames: ['blog_id'],
        name: 'IDX_BLOG_ID',
      }),
    );

    await queryRunner.createIndex(
      DATABASE_NAME.COMMENT,
      new TableIndex({
        columnNames: ['user_id'],
        name: 'IDX_USER_ID',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(DATABASE_NAME.COMMENT);

    if (!table) return;

    const foreignKeyBlogId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('blog_id') !== -1,
    );

    if (foreignKeyBlogId) {
      await queryRunner.dropForeignKey(DATABASE_NAME.COMMENT, foreignKeyBlogId);
    }

    const foreignKeyUserId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );

    if (foreignKeyUserId) {
      await queryRunner.dropForeignKey(DATABASE_NAME.COMMENT, foreignKeyUserId);
    }

    await queryRunner.dropIndex(DATABASE_NAME.COMMENT, 'IDX_BLOG_ID');
    await queryRunner.dropIndex(DATABASE_NAME.COMMENT, 'IDX_USER_ID');

    await queryRunner.dropTable(DATABASE_NAME.COMMENT);
  }
}
