import { SECRET_ANSWER_JWT, SECRET_ENCRYPT, SECRET_ENCRYPT_SALT, SECRET_JWT, SECRET_SESSION } from '@common/variable/environment';
import { refreshExpireTime, SESSION_EXPIRED_AT, tokenExpireTime, VERIFY_JWS_EXPIRED_AT } from '@common/variable/globals';
import { registerAs } from '@nestjs/config';

const secretConf = {
  jwt: SECRET_JWT,
  answerJwt: SECRET_ANSWER_JWT,
  answerJwtExpireTime: VERIFY_JWS_EXPIRED_AT,
  session: SECRET_SESSION,
  sessionExpireTime: SESSION_EXPIRED_AT,
  tokenExpireTime,
  refreshExpireTime,
  encrypt: SECRET_ENCRYPT,
  encryptSalt: SECRET_ENCRYPT_SALT,
} as const;

export default registerAs('secret', () => secretConf);
