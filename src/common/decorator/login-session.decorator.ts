import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CookieNameType } from '@share/enums/cookie-name-type';
import { Request } from 'express';

export const LoginSession = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;
  return request.cookies[CookieNameType.Session];
});
