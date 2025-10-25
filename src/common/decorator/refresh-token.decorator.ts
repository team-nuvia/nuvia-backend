import { RefreshTokenRequiredExceptionDto } from '@common/dto/exception/refresh-token-required.exception.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CookieNameType } from '@share/enums/cookie-name-type';

export const RefreshToken = createParamDecorator((_, ctx: ExecutionContext): string | LoginUserData => {
  const request = ctx.switchToHttp().getRequest();
  const refreshToken = request.cookies[CookieNameType.Refresh];

  if (!refreshToken) {
    throw new RefreshTokenRequiredExceptionDto();
  }

  return refreshToken;
});
