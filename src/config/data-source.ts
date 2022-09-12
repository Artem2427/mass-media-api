import { DataSource } from 'typeorm';
import databaseConfig from './database-config';

export const AppDataSource = new DataSource(databaseConfig);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
