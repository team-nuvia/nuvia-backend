import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractJwsToken = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.cookies['X-Client-Jws'];
});
