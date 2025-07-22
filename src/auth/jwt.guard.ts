import { PUBLIC_KEY } from '@common/variable/globals';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // constructor(private readonly utilService: UtilService) {
  //   return super.canActivate(context);
  // }

  // canActivate(context: ExecutionContext) {
  //   const http = context.switchToHttp();
  //   const request = http.getRequest<Request>();
  //   const bearerToken = request.headers.authorization;
  //   console.log('🚀 ~ JwtGuard ~ canActivate ~ bearerToken:', bearerToken);

  //   if (bearerToken) {
  //     if (!bearerToken?.startsWith('Bearer')) {
  //       throw new UnauthorizedException();
  //     }
  //     const token = bearerToken.slice(7);
  //     const decodedToken = this.utilService.decodeJWT(token);
  //     request.user = decodedToken;
  //   }

  //   return true;
  // }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.

    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      console.log('🚀 ~ JwtGuard ~ canActivate ~ isPublic:', isPublic);
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('🚀 ~ JwtGuard ~ handleRequest ~ info:', info);
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
