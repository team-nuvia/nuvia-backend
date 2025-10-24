import { SECRET_JWT } from '@common/variable/environment';
import { ACCESS_COOKIE_NAME } from '@common/variable/globals';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.[ACCESS_COOKIE_NAME]]),
      ignoreExpiration: false,
      secretOrKey: SECRET_JWT,
    });
  }

  async validate(payload: any): Promise<LoginUserData> {
    return { id: payload.id, provider: payload.provider };
  }
}
