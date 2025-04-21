import { ENVIRONMENT } from 'src/common/const/environment';

export const DATA_SOURCE_OPTION = {
  type: ENVIRONMENT.DATABASE_TYPE as any,
  host: ENVIRONMENT.DATABASE_HOST,
  port: Number(ENVIRONMENT.DATABASE_PORT),
  username: ENVIRONMENT.DATABASE_USERNAME,
  password: ENVIRONMENT.DATABASE_PASSWORD,
  database: ENVIRONMENT.DATABASE_SCHEMA,
  migrations: ['dist/migrations/*.js'],
  entities: ['dist/modules/**/entities/*.js'],
  synchronize: false,
};
