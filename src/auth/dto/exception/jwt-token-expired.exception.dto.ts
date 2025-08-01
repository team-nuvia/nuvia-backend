import { ErrorKey, UnauthorizedException } from '@common/dto/response';

export class ExpiredTokenException extends UnauthorizedException {
  constructor() {
    super({ code: ErrorKey.EXPIRED_TOKEN });
  }
}
