import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const LoginUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;
  return request.user ?? null;
});
