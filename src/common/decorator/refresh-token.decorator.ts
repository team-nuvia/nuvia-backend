import { RefreshTokenRequiredExceptionDto } from '@common/dto/exception/refresh-token-required.exception.dto';
import { REFRESH_COOKIE_NAME } from '@common/variable/globals';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshToken = createParamDecorator((_, ctx: ExecutionContext): string | LoginUserData => {
  const request = ctx.switchToHttp().getRequest();
  const refreshToken = request.cookies[REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    throw new RefreshTokenRequiredExceptionDto();
  }

  return refreshToken;
});
