import { DataSourceOptions } from 'typeorm';

export const mongoCofig: DataSourceOptions = {
  type: 'mongodb',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  logging: 'all',
};
