import { SESSION_COOKIE_NAME } from '@common/variable/globals';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const LoginSession = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;
  return request.cookies[SESSION_COOKIE_NAME];
});
