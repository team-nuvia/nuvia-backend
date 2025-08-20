import { SECRET_ANSWER_JWT, SECRET_JWT } from '@common/variable/environment';
import { refreshExpireTime, tokenExpireTime, VERIFY_JWS_EXPIRED_AT } from '@common/variable/globals';
import { registerAs } from '@nestjs/config';

const secretConf = {
  jwt: SECRET_JWT,
  answerJwt: SECRET_ANSWER_JWT,
  tokenExpireTime,
  answerJwtExpireTime: VERIFY_JWS_EXPIRED_AT,
  refreshExpireTime,
} as const;

export default registerAs('secret', () => secretConf);
