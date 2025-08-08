import { TX_META_KEY } from '@common/variable/globals';
import { applyDecorators, SetMetadata } from '@nestjs/common';

export function Transactional() {
  return applyDecorators(SetMetadata(TX_META_KEY, true));
}
