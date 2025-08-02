import { ExpiredTokenExceptionDto } from '@auth/dto/exception/jwt-token-expired.exception.dto';
import { UnauthorizedException } from '@common/dto/response';
import { PUBLIC_KEY } from '@common/variable/globals';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // console.log('🚀 ~ JwtGuard ~ handleRequest ~ _info:', info.message);
    // console.log('🚀 ~ JwtGuard ~ handleRequest ~ err:', err);
    // console.log('🚀 ~ JwtGuard ~ handleRequest ~ user:', user);
    if (err || !user) {
      if (info.message.includes('jwt expired')) {
        throw new ExpiredTokenExceptionDto();
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
