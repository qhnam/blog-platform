import { DATABASE_NAME } from 'src/common/const/database-name';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTextToContentColumnBlogTable1745130884674
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(DATABASE_NAME.BLOG, 'text', 'content');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(DATABASE_NAME.BLOG, 'content', 'text');
  }
}
