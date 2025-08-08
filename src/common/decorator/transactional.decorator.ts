import { applyDecorators, SetMetadata } from '@nestjs/common';

export const TX_META_KEY = 'useTx';
export function Transactional() {
  return applyDecorators(SetMetadata(TX_META_KEY, true));
}
