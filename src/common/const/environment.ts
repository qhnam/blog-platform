import * as dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENT = {
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_SCHEMA: process.env.DATABASE_SCHEMA,
  JWT_LIFE_TIME_ACCESS: process.env.JWT_LIFE_TIME_ACCESS ?? '1d',
  JWT_LIFE_TIME_REFRESH: process.env.JWT_LIFE_TIME_REFRESH ?? '3d',
};
