import { NoMatchUserInformationExceptionDto } from '@common/dto/exception/no-match-user-info.exception.dto';
import { Injectable } from '@nestjs/common';
import { UtilService } from '@util/util.service';
import { AuthRepository } from './auth.repository';
import { LoginTokenNestedResponseDto } from './dto/response/login-token.nested.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly utilService: UtilService,
  ) {}

  async login(payload: LoginUserData): Promise<LoginTokenNestedResponseDto> {
    return this.utilService.createJWT(payload);
  }

  async refresh(refreshTokenString: string): Promise<LoginTokenNestedResponseDto> {
    const refreshToken = this.utilService.decodeJWT(refreshTokenString);
    console.log('🚀 ~ AuthService ~ refresh ~ refreshToken:', refreshToken);
    const user = await this.authRepository.findUserById(refreshToken.id);
    console.log('🚀 ~ AuthService ~ refresh ~ user:', user);
    return this.utilService.refreshJWT(user);
  }

  verifyToken(token: string): boolean {
    return this.utilService.verifyJWT(token);
  }

  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findUserWithSecret(email);

    const { iteration, salt, password: hashedPassword } = user.userSecret;
    const verifyContent = { iteration, salt, password: hashedPassword };
    const isSame = this.utilService.verifyPassword(password, verifyContent);

    if (!isSame) {
      throw new NoMatchUserInformationExceptionDto();
    }

    return user;
  }
}
