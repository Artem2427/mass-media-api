import { DataSource } from 'typeorm';
import databaseConfig from './database-config';

export const SeedsDataSource = new DataSource({
  ...databaseConfig,
  migrations: [__dirname + '/../seeds/**/*{.ts,.js}'],
});
