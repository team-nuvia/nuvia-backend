import { EMAIL_PASSWORD, EMAIL_SERVICE, EMAIL_USER, IS_PROD } from '@common/variable/environment';
import { registerAs } from '@nestjs/config';

const emailConf = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: IS_PROD,
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
} as const;

export default registerAs('email', () => emailConf);
