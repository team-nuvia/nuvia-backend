import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '@common/variable/environment';
import { registerAs } from '@nestjs/config';

const socialProviderConfig = {
  google: {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
  },
} as const;

export default registerAs('socialProvider', () => socialProviderConfig);
