import { CommonService } from '@common/common.service';
import { NoMatchUserInformationExceptionDto } from '@common/dto/exception/no-match-user-info.exception.dto';
import { BadRequestException } from '@common/dto/response';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { UserAccessStatusType } from '@users/user-accesses/enums/user-access-status-type';
import { UtilService } from '@util/util.service';
import jwt from 'jsonwebtoken';
import { firstValueFrom } from 'rxjs';
import { AuthRepository } from './auth.repository';
import { UserLoginInformationPayloadDto } from './dto/payload/user-login-information.payload.dto';
import { LoginTokenNestedResponseDto } from './dto/response/login-token.nested.response.dto';
import { isNil } from '@util/isNil';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly utilService: UtilService,
    private readonly commonService: CommonService,
    private readonly httpService: HttpService,
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

  async urlImageToBuffer(url?: string | null) {
    if (!url || isNil(url)) return null;
    try {
      const { data } = await firstValueFrom(this.httpService.get(url, { responseType: 'arraybuffer' }));
      return Buffer.from(data, 'binary');
    } catch (error: any) {
      console.log('🚀 ~ AuthService ~ urlImageToBuffer ~ error:', error.message);
      /* 에러 무시 (프로필 이미지 없으면 없는 채로 진행되야 함) */
      return null;
    }
  }

  async socialLogin(token: SocialLoginGoogleIdTokenPayload, socialProvider: SocialProvider, query: Record<string, string>) {
    const decodedState = Buffer.from(query.state, 'base64url').toString('utf8');
    const { ipAddress, ...userLoginInformationPayloadDto } = JSON.parse(decodedState);

    const imageBuffer = await this.urlImageToBuffer(token.picture);
    const user = await this.authRepository.socialLogin(token, socialProvider, imageBuffer);

    const payload = { id: user.id, provider: socialProvider };
    const jwtInformation = this.utilService.createJWT(payload);
    const hmacSession = this.utilService.createHmacSession(payload);
    await this.authRepository.addUserAccessLog(payload.id, ipAddress, userLoginInformationPayloadDto, UserAccessStatusType.Login);

    return { ...jwtInformation, hmacSession };
  }

  async loginWithSocialProvider(
    ipAddress: string,
    userLoginInformationDto: Pick<UserLoginInformationPayloadDto, 'accessDevice' | 'accessBrowser' | 'accessUserAgent'>,
  ) {
    const socialProviderConfig = this.commonService.getConfig('socialProvider');

    const base64 = Buffer.from(JSON.stringify({ ipAddress, ...userLoginInformationDto })).toString('base64url');
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', socialProviderConfig.google.clientId);
    url.searchParams.append('redirect_uri', socialProviderConfig.google.redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'openid email profile');
    url.searchParams.append('access_type', 'offline');
    url.searchParams.append('include_granted_scopes', 'true');
    url.searchParams.append('state', base64);

    return url;
  }

  async loginWithSocialProviderCallback(query: Record<string, string>) {
    const socialProviderConfig = this.commonService.getConfig('socialProvider');
    const url = new URL('https://oauth2.googleapis.com/token');
    url.searchParams.append('client_id', socialProviderConfig.google.clientId);
    url.searchParams.append('client_secret', socialProviderConfig.google.clientSecret);
    url.searchParams.append('redirect_uri', socialProviderConfig.google.redirectUri);
    url.searchParams.append('code', query.code);
    url.searchParams.append('grant_type', 'authorization_code');

    try {
      const { data } = await firstValueFrom<{ data: SocialLoginGoogleIdToken }>(
        this.httpService.post(url.toString(), undefined, { headers: { 'Content-Type': 'application/json' } }),
      );

      const idToken = data.id_token;

      const decodedToken = jwt.decode(idToken) as SocialLoginGoogleIdTokenPayload;
      return decodedToken;
    } catch (error: any) {
      console.log('🚀 ~ AuthService ~ loginWithSocialProviderCallback ~ error:', error);
      throw new BadRequestException({ code: error.code, reason: error.message });
    }
  }

  async logout(loginUserData: LoginUserData, ipAddress: string) {
    await this.authRepository.addUserAccessLog(loginUserData.id, ipAddress, null, UserAccessStatusType.Logout);
  }

  async refresh(refreshTokenString: string): Promise<LoginTokenNestedResponseDto> {
    const refreshToken = this.utilService.decodeJWT(refreshTokenString);
    const user = await this.authRepository.findUserById(refreshToken.id, refreshToken.provider);

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

  async validateUser(email: string, password: string, provider: SocialProvider) {
    const user = await this.authRepository.findUserWithSecret(email, provider);

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
