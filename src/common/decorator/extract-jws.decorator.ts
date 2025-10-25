import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CookieNameType } from '@share/enums/cookie-name-type';

export const ExtractJwsToken = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.cookies[CookieNameType.Jws];
});
