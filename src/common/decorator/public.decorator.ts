import { PUBLIC_KEY } from '@common/variable/globals';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(PUBLIC_KEY, true);
