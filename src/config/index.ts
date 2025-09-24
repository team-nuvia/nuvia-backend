import commonConfig from './common.config';
import emailConfig from './email.config';
import secretConfig from './secret.config';
import socialProviderConfig from './social-provider.config';
import { typeormConfig } from './typeorm.config';

export const config = {
  common: commonConfig,
  database: typeormConfig,
  secret: secretConfig,
  email: emailConfig,
  socialProvider: socialProviderConfig,
} as const;
