import { SESSION_KEY } from '@common/variable/globals';
import { applyDecorators, CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiCookieAuth } from '@nestjs/swagger';
import { CookieNameType } from '@share/enums/cookie-name-type';
import { Request } from 'express';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isSession = this.reflector.getAllAndOverride<boolean>(SESSION_KEY, [context.getHandler(), context.getClass()]);

    if (isSession) {
      const request = context.switchToHttp().getRequest() as Request;
      const session = request.cookies[CookieNameType.Session];

      if (!session) {
        throw new UnauthorizedException();
      }

      request.user = session;

      return true;
    }

    return false;
  }
}

export const RequiredSession = () => applyDecorators(SetMetadata(SESSION_KEY, true), UseGuards(SessionGuard), ApiCookieAuth(CookieNameType.Session));
