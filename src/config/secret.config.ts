import { SECRET_ANSWER_JWT, SECRET_ENCRYPT, SECRET_ENCRYPT_SALT, SECRET_JWT, SECRET_SESSION } from '@common/variable/environment';
import {
  COOKIE_ACCESS_EXPIRE_TIME,
  COOKIE_REFRESH_EXPIRE_TIME,
  COOKIE_SESSION_EXPIRE_TIME,
  JWT_REFRESH_EXPIRE_TIME,
  JWT_TOKEN_EXPIRE_TIME,
  VERIFY_JWS_EXPIRE_TIME,
} from '@common/variable/globals';
import { registerAs } from '@nestjs/config';

const secretConf = {
  jwt: SECRET_JWT,
  answerJwt: SECRET_ANSWER_JWT,
  answerJwtExpireTime: VERIFY_JWS_EXPIRE_TIME,
  session: SECRET_SESSION,
  cookieSessionExpireTime: COOKIE_SESSION_EXPIRE_TIME,
  cookieAccessExpireTime: COOKIE_ACCESS_EXPIRE_TIME,
  cookieRefreshExpireTime: COOKIE_REFRESH_EXPIRE_TIME,
  jwtTokenExpireTime: JWT_TOKEN_EXPIRE_TIME,
  jwtRefreshExpireTime: JWT_REFRESH_EXPIRE_TIME,
  encrypt: SECRET_ENCRYPT,
  encryptSalt: SECRET_ENCRYPT_SALT,
} as const;

export default registerAs('secret', () => secretConf);
