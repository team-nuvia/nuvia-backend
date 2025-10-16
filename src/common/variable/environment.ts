import { envConsumer } from '@util/envConsumer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { RunMode } from './enums/run-mode.enum';
import { RunOn } from './enums/run-on.enum';

const getOriginEnvAs = envConsumer(process.env);

export const RUN_MODE = getOriginEnvAs(String, 'NODE_ENV', RunMode.Production) as RunMode;
export const RUN_ON = process.env.RUN_ON as RunOn;

/* 공통 환경변수 가져오기 */
dotenv.config({
  path: path.join(path.resolve(), '.env'),
});

/* 환경변수 체크 */
const envFilename = `.env.${RUN_MODE}${RUN_ON ? `.${RUN_ON}` : ''}`;
console.log('🚀 ~ envFilename:', envFilename);
if (fs.existsSync(envFilename)) {
  dotenv.config({
    path: path.join(path.resolve(), envFilename),
    override: true,
  });
}

const getEnvAs = envConsumer(process.env);

export const IS_PROD = RUN_MODE === RunMode.Production;
export const IS_DEV = RUN_MODE === RunMode.Development;
export const IS_TEST = RUN_MODE === RunMode.Test;
export const IS_LOCAL = RUN_ON === RunOn.Local;

export const CLIENT_URL = getEnvAs(String, 'CLIENT_URL', 'http://localhost:5000');
export const SERVER_URL = getEnvAs(String, 'SERVER_URL', 'http://localhost:3000');
export const HOST = getEnvAs(String, 'HOST');
export const PORT = getEnvAs(Number, 'PORT');

export const DB_USERNAME = getEnvAs(String, 'DB_USERNAME');
export const DB_PASSWORD = getEnvAs(String, 'DB_PASSWORD');
export const DB_NAME = getEnvAs(String, 'DB_NAME');
export const DB_HOST = getEnvAs(String, 'DB_HOST');
export const DB_PORT = getEnvAs(Number, 'DB_PORT');
export const DB_LOG = getEnvAs(Boolean, 'DB_LOG');

export const SERVER_VERSION = getEnvAs(String, 'SERVER_VERSION');
export const DEPLOY_VERSION = getEnvAs(String, 'DEPLOY_VERSION');

export const LOG_DIR = getEnvAs(String, 'LOG_DIR');
export const LOG_EXT = getEnvAs(String, 'LOG_EXT');
export const LOG_ACTIVATE = getEnvAs(Boolean, 'LOG_ACTIVATE', true);
export const LOG_SAVE_ACTIVATE = getEnvAs(Boolean, 'LOG_SAVE_ACTIVATE', true);

export const SECRET_SESSION = getEnvAs(String, 'SECRET_SESSION');
export const SECRET_JWT = getEnvAs(String, 'SECRET_JWT');
export const SECRET_ANSWER_JWT = getEnvAs(String, 'SECRET_ANSWER_JWT');
export const SECRET_ENCRYPT = getEnvAs(String, 'SECRET_ENCRYPT');
export const SECRET_ENCRYPT_SALT = getEnvAs(String, 'SECRET_ENCRYPT_SALT');

export const EMAIL_SERVICE = getEnvAs(String, 'EMAIL_SERVICE');
export const EMAIL_USER = getEnvAs(String, 'EMAIL_USER');
export const EMAIL_PASSWORD = getEnvAs(String, 'EMAIL_PASSWORD');

/* Google 관련 환경변수 */
export const GOOGLE_CLIENT_ID = getEnvAs(String, 'GOOGLE_CLIENT_ID');
export const GOOGLE_CLIENT_SECRET = getEnvAs(String, 'GOOGLE_CLIENT_SECRET');
export const GOOGLE_REDIRECT_URI = getEnvAs(String, 'GOOGLE_REDIRECT_URI');

/* Kakao 관련 환경변수 */
export const KAKAO_CLIENT_ID = getEnvAs(String, 'KAKAO_CLIENT_ID');
export const KAKAO_REDIRECT_URI = getEnvAs(String, 'KAKAO_REDIRECT_URI');

export const CERT_KEY = process.env.CERT_KEY as string;
export const PRIV_KEY = process.env.PRIV_KEY as string;

export const DOMAIN = process.env.DOMAIN as string;
