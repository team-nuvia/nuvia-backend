import { NoMatchUserInformationExceptionDto } from '@common/dto/exception/no-match-user-info.exception.dto';
import { Injectable } from '@nestjs/common';
import { UserAccessStatusType } from '@users/user-accesses/enums/user-access-status-type';
import { UtilService } from '@util/util.service';
import { AuthRepository } from './auth.repository';
import { UserLoginInformationPayloadDto } from './dto/payload/user-login-information.payload.dto';
import { LoginTokenNestedResponseDto } from './dto/response/login-token.nested.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly utilService: UtilService,
  ) {}

  async login(
    payload: LoginUserData,
    ipAddress: string,
    userLoginInformationPayloadDto: UserLoginInformationPayloadDto,
  ): Promise<LoginTokenNestedResponseDto> {
    const jwtInformation = this.utilService.createJWT(payload);
    const hmacSession = this.utilService.createHmacSession(payload);
    await this.authRepository.addUserAccessLog(payload.id, ipAddress, userLoginInformationPayloadDto, UserAccessStatusType.Login);

    return { ...jwtInformation, hmacSession };
  }

  async logout(loginUserData: LoginUserData, ipAddress: string) {
    await this.authRepository.addUserAccessLog(loginUserData.id, ipAddress, null, UserAccessStatusType.Logout);
  }

  async refresh(refreshTokenString: string): Promise<LoginTokenNestedResponseDto> {
    const refreshToken = this.utilService.decodeJWT(refreshTokenString);
    // console.log('🚀 ~ AuthService ~ refresh ~ refreshToken:', refreshToken);
    const user = await this.authRepository.findUserById(refreshToken.id);
    // console.log('🚀 ~ AuthService ~ refresh ~ user:', user);

    const jwtInformation = this.utilService.refreshJWT(user);
    const hmacSession = this.utilService.createHmacSession(user);
    return { ...jwtInformation, hmacSession };
  }

  verifyHmacSession(token: string): string | null {
    return this.utilService.verifyHmacSession(token);
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

  async verifyInvitationToken(token: string, userId: number): Promise<boolean> {
    const { verified, inviteeId, subscriptionId } = await this.utilService.parseInvitationToken(token);

    if (inviteeId !== userId) throw new NoMatchUserInformationExceptionDto();

    await this.authRepository.joinOrganization(inviteeId, subscriptionId);

    return verified;
  }
}
