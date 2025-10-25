import { SECRET_JWT } from '@common/variable/environment';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { CookieNameType } from '@share/enums/cookie-name-type';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.[CookieNameType.Access]]),
      ignoreExpiration: false,
      secretOrKey: SECRET_JWT,
    });
  }

  async validate(payload: any): Promise<LoginUserData> {
    return { id: payload.id, provider: payload.provider };
  }
}
