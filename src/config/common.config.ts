import {
  DEPLOY_VERSION,
  HOST,
  LOG_ACTIVATE,
  LOG_SAVE_ACTIVATE,
  PORT,
  RUN_MODE,
  RUN_ON,
  SERVE_HOST,
  SERVER_URL,
  SERVER_VERSION,
} from '@common/variable/environment';
import { registerAs } from '@nestjs/config';

const commonConf = {
  version: `V${SERVER_VERSION}.${DEPLOY_VERSION}`,
  serveHost: SERVE_HOST,
  serverUrl: SERVER_URL,
  host: HOST,
  port: PORT,
  runMode: RUN_MODE,
  runOn: RUN_ON,
  logActivate: LOG_ACTIVATE,
  logSaveActivate: LOG_SAVE_ACTIVATE,
};

export default registerAs('common', () => commonConf);
