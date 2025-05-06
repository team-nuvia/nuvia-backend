import { SECRET_JWT } from '@common/variable/environment';
import { refreshExpireTime, tokenExpireTime } from '@common/variable/globals';
import { registerAs } from '@nestjs/config';

const secretConf = {
  jwt: SECRET_JWT,
  tokenExpireTime,
  refreshExpireTime,
} as const;

export default registerAs('secret', () => secretConf);
