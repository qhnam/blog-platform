import { DATABASE_NAME } from 'src/common/const/database-name';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

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
            type: 'bigint',
            name: 'blog_id',
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
        ],
      }),
    );

    await queryRunner.createForeignKey(
      DATABASE_NAME.CATEGORY,
      new TableForeignKey({
        columnNames: ['blog_id'],
        referencedColumnNames: ['id'],
        referencedTableName: DATABASE_NAME.BLOG,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      DATABASE_NAME.CATEGORY,
      new TableIndex({
        columnNames: ['blog_id'],
        name: 'IDX_BLOG_ID',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(DATABASE_NAME.CATEGORY);

    if (!table) return;

    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('blog_id') !== -1,
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey(DATABASE_NAME.CATEGORY, foreignKey);
    }

    await queryRunner.dropIndex(DATABASE_NAME.CATEGORY, 'IDX_BLOG_ID');
    await queryRunner.dropTable(DATABASE_NAME.CATEGORY);
  }
}
