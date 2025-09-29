import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const LoginToken = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  // const authorization = request.headers.authorization;
  // request.token = authorization?.slice(7) ?? null;
  request.token = request.cookies['access_token'] ?? null;
  return request.token;
});
