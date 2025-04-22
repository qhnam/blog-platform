import { DATABASE_NAME } from 'src/common/const/database-name';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnStatusAndUsernameUserTable1745294353679
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(DATABASE_NAME.USER, [
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: false,
      }),
      new TableColumn({
        name: 'fullname',
        type: 'varchar',
        length: '100',
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(DATABASE_NAME.USER, ['status', 'fullname']);
  }
}
