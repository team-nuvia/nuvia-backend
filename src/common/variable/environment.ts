import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { envConsumer } from 'src/util/envConsumer';

export const RUN_MODE = process.env.NODE_ENV ?? 'production';
export const RUN_ON = process.env.RUN_ON ?? 'local';

/* 공통 환경변수 가져오기 */
dotenv.config({
  path: path.join(path.resolve(), '.env'),
});
/* 환경변수 체크 */
if (fs.existsSync(`.env.${RUN_MODE}.${RUN_ON}`)) {
  dotenv.config({
    path: path.join(path.resolve(), `.env.${RUN_MODE}.${RUN_ON}`),
    override: true,
  });
}

const getEnvAs = envConsumer(process.env);

export const IS_DEV = RUN_MODE === 'development';

export const HOST = getEnvAs(String, 'HOST');
export const PORT = getEnvAs(Number, 'PORT');

export const DB_USERNAME = getEnvAs(String, 'DB_USERNAME');
export const DB_PASSWORD = getEnvAs(String, 'DB_PASSWORD');
export const DB_NAME = getEnvAs(String, 'DB_NAME');
export const DB_HOST = getEnvAs(String, 'DB_HOST');
export const DB_PORT = getEnvAs(Number, 'DB_PORT');

export const SERVER_VERSION = getEnvAs(String, 'SERVER_VERSION');
export const DEPLOY_VERSION = getEnvAs(String, 'DEPLOY_VERSION');

export const LOG_DIR = getEnvAs(String, 'LOG_DIR');
export const LOG_EXT = getEnvAs(String, 'LOG_EXT');
