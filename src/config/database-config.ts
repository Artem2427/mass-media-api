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
  synchronize: process.env.PROD === 'false' ? false : true,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
};

export default databaseConfig;
