import { ENVIRONMENT } from 'src/common/const/environment';
import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: ENVIRONMENT.DATABASE_HOST,
  port: Number(ENVIRONMENT.DATABASE_PORT),
  username: ENVIRONMENT.DATABASE_USERNAME,
  password: ENVIRONMENT.DATABASE_PASSWORD,
  database: ENVIRONMENT.DATABASE_SCHEMA,
  migrations: ['dist/migrations/*.js'],
  entities: ['dist/modules/**/entities/*.js'],
  synchronize: false,
};

module.exports = {
  dataSource: new DataSource(dataSourceOptions),
} as {
  dataSource: DataSource;
};
