import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CookieNameType } from '@share/enums/cookie-name-type';

// TODO: 이후 가드로 전환 할지 검토 - 2025-08-18 14:45:31
export const ExtractSubmissionHash = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.cookies[CookieNameType.SubmissionHash];
});
