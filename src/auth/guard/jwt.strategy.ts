import { SECRET_JWT } from '@common/variable/environment';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET_JWT,
    });
  }

  async validate(payload: any): Promise<LoginUserData> {
    console.log('🚀 ~ JwtStrategy ~ validate ~ payload:', payload);
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      // nickname: payload.nickname,
      role: payload.role,
    };
  }
}
