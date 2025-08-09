import { RefreshTokenRequiredExceptionDto } from '@common/dto/exception/refresh-token-required.exception.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshToken = createParamDecorator((_, ctx: ExecutionContext): string | LoginUserData => {
  const request = ctx.switchToHttp().getRequest();
  const refreshToken = request.cookies['refresh_token'];

  if (!refreshToken) {
    throw new RefreshTokenRequiredExceptionDto();
  }

  return refreshToken;
});
