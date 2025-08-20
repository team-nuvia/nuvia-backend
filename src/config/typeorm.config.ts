import {
  DB_HOST,
  DB_LOG,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  IS_DEV,
  IS_PROD,
  IS_TEST,
} from '@common/variable/environment';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const datasourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: IS_TEST ? ['test', DB_NAME].join('_') : DB_NAME,
  timezone: 'UTC',
  logger: 'advanced-console',
  logging: DB_LOG
    ? IS_TEST || IS_DEV
      ? ['query', 'info', 'log', 'error']
      : ['error']
    : false,
  poolSize: 20,
  entities: [
    // path.join(path.resolve(), '/src/**/*.entity.{js,ts}'),
    __dirname + '/../**/*.entity.{ts,js}',
  ],
  namingStrategy: new SnakeNamingStrategy(),
  // dropSchema: IS_TEST,
  synchronize: !IS_PROD,
  migrations: [path.join(__dirname + '/../migrations/*.ts')],
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
  migrationsRun: true,
};

export const typeormConfig = registerAs(
  'database',
  () =>
    ({ ...datasourceOptions, autoLoadEntities: true }) as TypeOrmModuleOptions,
);
