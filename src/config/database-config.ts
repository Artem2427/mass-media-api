import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL_PROD ?? process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL_PROD
    ? {
        rejectUnauthorized: false,
      }
    : false,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
};

export default databaseConfig;
