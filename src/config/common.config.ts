import {
  DEPLOY_VERSION,
  HOST,
  PORT,
  SERVER_VERSION,
} from '@common/variable/environment';
import { registerAs } from '@nestjs/config';

const commonConf = {
  version: `V${SERVER_VERSION}.${DEPLOY_VERSION}`,
  host: HOST,
  port: PORT,
};

export default registerAs('common', () => commonConf);
