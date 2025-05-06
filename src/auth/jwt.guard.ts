import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UtilService } from '@util/util.service';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly utilService: UtilService) {}

  canActivate(context: ExecutionContext) {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const bearerToken = request.headers.authorization;

    if (bearerToken) {
      if (!bearerToken?.startsWith('Bearer')) {
        throw new UnauthorizedException();
      }
      const token = bearerToken.slice(7);
      const decodedToken = this.utilService.decodeJWT(token);
      request.user = decodedToken;
    }

    return true;
  }
}
