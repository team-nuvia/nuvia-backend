import {
  DB_HOST,
  DB_LOG,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  IS_DEV,
  IS_TEST,
} from '@common/variable/environment';
import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeormOptions: DataSourceOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: IS_TEST ? ['test', DB_NAME].join('_') : DB_NAME,
  timezone: '+09:00',
  logger: 'advanced-console',
  logging: DB_LOG
    ? IS_TEST || IS_DEV
      ? ['query', 'info', 'log', 'error']
      : ['error']
    : false,
  poolSize: 20,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
  dropSchema: IS_DEV,
  synchronize: IS_DEV,
  // migrations: [Migrations1746530610706],
  // migrationsRun: IS_TEST,
};

export const typeormConfig = registerAs('database', () => typeormOptions);
