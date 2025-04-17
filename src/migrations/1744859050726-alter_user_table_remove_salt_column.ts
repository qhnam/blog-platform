import { DATABASE_NAME } from 'src/common/const/database-name';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUserTableRemoveSaltColumn1744859050726
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(DATABASE_NAME.USER, 'salt');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      DATABASE_NAME.USER,
      new TableColumn({
        type: 'varchar',
        name: 'salt',
        length: '64',
        isNullable: false,
      }),
    );
  }
}
