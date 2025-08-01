import { NoMatchUserInformationException } from '@common/dto/exception/no-match-user-info.exception.dto';
import { ErrorKey } from '@common/dto/response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil } from '@util/isNil';
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

  verifyToken(token: string): boolean {
    return this.utilService.verifyJWT(token);
  }

  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findUserWithSecret(email);

    if (isNil(user) || isNil(user.userSecret)) {
      throw new NotFoundException({ code: ErrorKey.NOT_FOUND_USER, reason: email });
    }

    const { iteration, salt, password: hashedPassword } = user.userSecret;
    const verifyContent = { iteration, salt, password: hashedPassword };
    const isSame = this.utilService.verifyPassword(password, verifyContent);

    if (!isSame) {
      throw new NoMatchUserInformationException();
    }

    return user;
  }
}
