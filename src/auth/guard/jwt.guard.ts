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
    console.log('🚀 ~ JwtGuard ~ canActivate ~ isPublic:', isPublic);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any) {
    console.log('🚀 ~ JwtGuard ~ handleRequest ~ err:', err);
    console.log('🚀 ~ JwtGuard ~ handleRequest ~ user:', user);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
