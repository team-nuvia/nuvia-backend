import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('🚀 ~ LocalStrategy ~ validate ~ username:', username);
    const user = await this.authService.validateUser(username, password);

    /* generate token data */
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      role: user.role,
    } as LoginUserData;
  }
}
