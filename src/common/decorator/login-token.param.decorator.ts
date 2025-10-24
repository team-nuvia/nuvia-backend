import { ACCESS_COOKIE_NAME } from '@common/variable/globals';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const LoginToken = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  request.token = request.cookies[ACCESS_COOKIE_NAME] ?? null;
  return request.token;
});
