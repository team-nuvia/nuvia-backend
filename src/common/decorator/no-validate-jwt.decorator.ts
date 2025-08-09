import { NO_VALIDATE_JWT } from '@common/variable/globals';
import { SetMetadata } from '@nestjs/common';

export const NoValidateJwt = () => SetMetadata(NO_VALIDATE_JWT, true);
