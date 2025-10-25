import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CookieNameType } from '@share/enums/cookie-name-type';
import { Request } from 'express';

export const LoginToken = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  request.token = request.cookies[CookieNameType.Access] ?? null;
  return request.token;
});
