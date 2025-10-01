import { EmailsService } from '@/emails/emails.service';
import { CommonService } from '@common/common.service';
import { NoMatchUserInformationExceptionDto } from '@common/dto/exception/no-match-user-info.exception.dto';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { BadRequestException } from '@common/dto/response';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { UserAccessStatusType } from '@share/enums/user-access-status-type';
import { isNil } from '@util/isNil';
import { UtilService } from '@util/util.service';
import jwt from 'jsonwebtoken';
import { firstValueFrom } from 'rxjs';
import { AuthRepository } from './auth.repository';
import { ResetPasswordSendPayloadDto } from './dto/payload/reset-password-send.payload.dto';
import { ResetPasswordVerifyPayloadDto } from './dto/payload/reset-password-verify.payload.dto';
import { ResetPasswordPayloadDto } from './dto/payload/reset-password.payload.dto';
import { UserLoginInformationPayloadDto } from './dto/payload/user-login-information.payload.dto';
import { LoginTokenNestedResponseDto } from './dto/response/login-token.nested.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly utilService: UtilService,
    private readonly commonService: CommonService,
    private readonly httpService: HttpService,
    private readonly emailsService: EmailsService,
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

  async socialLogin(
    token: SocialLoginGoogleIdTokenPayload | SocialLoginKakaoIdTokenPayload,
    socialProvider: SocialProvider,
    query: Record<string, string>,
  ) {
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

  async getGoogleLoginUrl(
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

  async getKakaoLoginUrl(
    ipAddress: string,
    userLoginInformationDto: Pick<UserLoginInformationPayloadDto, 'accessDevice' | 'accessBrowser' | 'accessUserAgent'>,
  ) {
    const socialProviderConfig = this.commonService.getConfig('socialProvider');
    const base64 = Buffer.from(JSON.stringify({ ipAddress, ...userLoginInformationDto })).toString('base64url');
    const url = new URL('https://kauth.kakao.com/oauth/authorize');
    url.searchParams.append('client_id', socialProviderConfig.kakao.clientId);
    url.searchParams.append('redirect_uri', socialProviderConfig.kakao.redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('state', base64);
    return url;
  }

  async loginWithSocialProvider(
    ipAddress: string,
    userLoginInformationDto: Pick<UserLoginInformationPayloadDto, 'accessDevice' | 'accessBrowser' | 'accessUserAgent'>,
    socialProvider: SocialProvider,
  ) {
    let url: URL;
    switch (socialProvider) {
      case SocialProvider.Google:
        url = await this.getGoogleLoginUrl(ipAddress, userLoginInformationDto);
        return url;
      case SocialProvider.Kakao:
        url = await this.getKakaoLoginUrl(ipAddress, userLoginInformationDto);
        return url;
      default:
        throw new BadRequestException({ code: 'BAD_REQUEST', reason: 'Invalid social provider' });
    }
  }

  async googleLoginWithSocialProviderCallback(query: Record<string, string>) {
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

  async kakaoLoginWithSocialProviderCallback(query: Record<string, string>) {
    const socialProviderConfig = this.commonService.getConfig('socialProvider');
    const url = new URL('https://kauth.kakao.com/oauth/token');
    url.searchParams.append('client_id', socialProviderConfig.kakao.clientId);
    url.searchParams.append('redirect_uri', socialProviderConfig.kakao.redirectUri);
    url.searchParams.append('code', query.code);
    url.searchParams.append('grant_type', 'authorization_code');

    try {
      const { data } = await firstValueFrom<{ data: SocialLoginKakaoIdToken }>(
        this.httpService.post(url.toString(), undefined, { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } }),
      );

      const idToken = data.id_token;

      const decodedToken = jwt.decode(idToken) as SocialLoginKakaoIdTokenPayload;
      console.log('✨ kakao decodedToken:', decodedToken);
      return decodedToken;
    } catch (error: any) {
      console.log('🚀 ~ AuthService ~ loginWithSocialProviderCallback ~ error:', error);
      throw new BadRequestException({ code: error.code, reason: error.message });
    }
  }

  async loginWithSocialProviderCallback(query: Record<string, string>, socialProvider: SocialProvider) {
    switch (socialProvider) {
      case SocialProvider.Google:
        return this.googleLoginWithSocialProviderCallback(query);
      case SocialProvider.Kakao:
        return this.kakaoLoginWithSocialProviderCallback(query);
      default:
        throw new BadRequestException({ code: 'BAD_REQUEST', reason: 'Invalid social provider' });
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

  async resetPasswordSend(resetPasswordDto: ResetPasswordSendPayloadDto) {
    const { email, token } = resetPasswordDto;
    console.log('🚀 ~ AuthService ~ resetPasswordSend ~ token:', token);

    /* 이메일 전송 정상 요청 확인 토큰 */
    if (!this.verifyCsrfToken(token)) throw new BadRequestException();

    const user = await this.authRepository.findUserByEmail(email, SocialProvider.Local);
    const secret = this.commonService.getConfig('secret');

    if (!user) throw new NotFoundUserExceptionDto();

    const otpToken = await this.emailsService.sendResetPasswordEmail(email);

    const timestamp = Date.now();
    const emailEncode = this.utilService.encodeLongToken(email);
    const otpTokenEncode = this.utilService.encodeLongToken(otpToken.toString());
    const brandEncode = this.utilService.encodeLongToken(secret.encrypt);
    const timestampEncode = this.utilService.encodeLongToken(timestamp.toString());
    const verifyToken = this.utilService.encodeLongToken(`${emailEncode}:${brandEncode}:${otpTokenEncode}:${timestampEncode}`);
    return verifyToken;
  }

  async resetPasswordVerify(resetPasswordVerifyDto: ResetPasswordVerifyPayloadDto) {
    const { token, otpToken } = resetPasswordVerifyDto;
    const decodedToken = this.utilService.decodeLongToken(token);
    const [emailEncode, brandEncode, otpTokenEncode, timestampEncode] = decodedToken.split(':');
    const email = this.utilService.decodeLongToken(emailEncode);
    const brandDecode = this.utilService.decodeLongToken(brandEncode);
    const otpTokenDecode = this.utilService.decodeLongToken(otpTokenEncode);
    const timestampDecode = this.utilService.decodeLongToken(timestampEncode);
    const secret = this.commonService.getConfig('secret');

    /* 토큰 시간 검증 - 1시간 */
    if (Date.now() - parseInt(timestampDecode) > 1000 * 60 * 60 * 1) throw new BadRequestException();

    /* 브랜드 보안 값 검증 */
    if (brandDecode !== secret.encrypt) throw new BadRequestException();

    /* OTP 토큰 검증 */
    if (otpTokenDecode !== otpToken) throw new BadRequestException();

    /* 회원 검증 */
    return this.authRepository.findUserByEmail(email, SocialProvider.Local);
  }

  async resetPassword(resetPasswordDto: ResetPasswordPayloadDto, ipAddress: string) {
    const { email, password, token, otpToken, confirmPassword, accessDevice, accessBrowser, accessUserAgent } = resetPasswordDto;

    if (password !== confirmPassword) throw new BadRequestException();

    const user = await this.resetPasswordVerify({ token, otpToken });

    if (!user) throw new NotFoundUserExceptionDto();

    const { hashedPassword, salt, iteration } = this.utilService.hashPassword(password);

    await this.authRepository.updateUserSecret(user.id, email, hashedPassword, salt, iteration, ipAddress, {
      accessDevice,
      accessBrowser,
      accessUserAgent,
    });
  }

  csrfToken() {
    const source = this.utilService.encodeToken(this.commonService.getConfig('secret').encrypt);
    return this.utilService.encodeToken(`nuvia:${Date.now()}:${source}`);
  }

  verifyCsrfToken(csrfToken: string) {
    const decodedToken = this.utilService.decodeToken(csrfToken);
    console.log('🚀 ~ AuthService ~ verifyCsrfToken ~ decodedToken:', decodedToken);
    const [brandHash, timestamp, source] = decodedToken.split(':');
    const sourceDecode = this.utilService.decodeToken(source);

    const isExpiredTimestamp = Date.now() - parseInt(timestamp) > 1000 * 60 * 60 * 1;
    const isAcceptSource = sourceDecode === this.commonService.getConfig('secret').encrypt;
    const isAcceptBrand = brandHash === 'nuvia';

    return isAcceptBrand && isAcceptSource && !isExpiredTimestamp;
  }
}
