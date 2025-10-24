import { ExpiredTokenExceptionDto } from '@auth/dto/exception/jwt-token-expired.exception.dto';
import { UnauthorizedException } from '@common/dto/response';
import { ACCESS_COOKIE_NAME, PUBLIC_KEY } from '@common/variable/globals';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@ApiCookieAuth(ACCESS_COOKIE_NAME)
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      const request = context.switchToHttp().getRequest() as Request;
      const accessToken = request.cookies[ACCESS_COOKIE_NAME];

      if (accessToken) {
        const decoded = jwt.decode(accessToken, { json: true }) as unknown as LoginUserData;
        request.user = decoded;
      }

      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info.message.includes('jwt expired')) {
        throw new ExpiredTokenExceptionDto();
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
