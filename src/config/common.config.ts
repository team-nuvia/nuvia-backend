import {
  CLIENT_URL,
  DEPLOY_VERSION,
  DOMAIN,
  HOST,
  LOG_ACTIVATE,
  LOG_SAVE_ACTIVATE,
  PORT,
  RUN_MODE,
  RUN_ON,
  SERVER_URL,
  SERVER_VERSION,
} from '@common/variable/environment';
import { registerAs } from '@nestjs/config';

const commonConf = {
  version: `V${SERVER_VERSION}.${DEPLOY_VERSION}`,
  clientUrl: CLIENT_URL,
  serverUrl: SERVER_URL,
  host: HOST,
  port: PORT,
  runMode: RUN_MODE,
  runOn: RUN_ON,
  logActivate: LOG_ACTIVATE,
  logSaveActivate: LOG_SAVE_ACTIVATE,
  domain: DOMAIN,
};

export default registerAs('common', () => commonConf);
