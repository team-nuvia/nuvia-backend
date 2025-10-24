import { JWS_COOKIE_NAME } from '@common/variable/globals';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractJwsToken = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.cookies[JWS_COOKIE_NAME];
});
