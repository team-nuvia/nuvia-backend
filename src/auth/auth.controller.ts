import { NotFoundNotificationExceptionDto } from '@/notifications/dto/exception/not-found-notification.exception.dto';
import { AlreadyJoinedUserExceptionDto } from '@/subscriptions/dto/exception/already-joined-user.exception.dto';
import { NotFoundOrganizationRoleExceptionDto } from '@/subscriptions/organization-roles/dto/exception/not-found-organization-role.exception.dto';
import { CommonService } from '@common/common.service';
import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginSession } from '@common/decorator/login-session.decorator';
import { LoginToken } from '@common/decorator/login-token.param.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { Public } from '@common/decorator/public.decorator';
import { RefreshToken } from '@common/decorator/refresh-token.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Transactional } from '@common/decorator/transactional.decorator';
import { NoMatchUserInformationExceptionDto } from '@common/dto/exception/no-match-user-info.exception.dto';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { CLIENT_URL, IS_PROD } from '@common/variable/environment';
import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CookieNameType } from '@share/enums/cookie-name-type';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ResetPasswordSendPayloadDto } from './dto/payload/reset-password-send.payload.dto';
import { ResetPasswordVerifyPayloadDto } from './dto/payload/reset-password-verify.payload.dto';
import { ResetPasswordPayloadDto } from './dto/payload/reset-password.payload.dto';
import { SocialLoginInformationPayloadDto } from './dto/payload/social-login-information.payload.dto';
import { UserLoginInformationPayloadDto } from './dto/payload/user-login-information.payload.dto';
import { VerifyInvitationTokenPayloadDto } from './dto/payload/verify-invitation-token.payload.dto';
import { AlreadyLoggedOutResponseDto } from './dto/response/already-logged-out.response.dto';
import { CsrfTokenResponseDto } from './dto/response/csrf-token.response.dto';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { LogoutResponseDto } from './dto/response/logout.response.dto';
import { RefreshResponseDto } from './dto/response/refesh.response.dto';
import { ResetPasswordSendResponseDto } from './dto/response/reset-password-send.response.dto';
import { ResetPasswordVerifyResponseDto } from './dto/response/reset-password-verify.response.dto';
import { ResetPasswordResponseDto } from './dto/response/reset-password.response.dto';
import { VerifyInvitationTokenResponseDto } from './dto/response/verify-invitation-token.response.dto';
import { VerifySessionResponseDto } from './dto/response/verify-session.response.dto';
import { VerifyTokenResponseDto } from './dto/response/verify-token.response.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RequiredSession } from './guard/session.guard';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commonConfig: CommonService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiOperation({ summary: '로그인' })
  @CombineResponses(HttpStatus.OK, LoginResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationExceptionDto)
  @Transactional()
  @Post('login')
  async login(
    @LoginUser() loginUserData: LoginUserData,
    @Body() userLoginInformationDto: UserLoginInformationPayloadDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const secretConfig = this.commonConfig.getConfig('secret');
    const domain = this.commonConfig.getConfig('common').domain;
    const token = await this.authService.login(loginUserData, req.realIp, userLoginInformationDto);

    res.cookie(CookieNameType.Access, token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieAccessExpireTime,
      domain: IS_PROD ? domain : undefined,
    });

    res.cookie(CookieNameType.Refresh, token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieRefreshExpireTime,
      domain: IS_PROD ? domain : undefined,
    });

    res.cookie(CookieNameType.Session, token.hmacSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieSessionExpireTime,
      domain: IS_PROD ? domain : undefined,
    });

    /* 액세스 토큰만 반환 - 프론트에서 localStorage 사용 */
    return new LoginResponseDto();
  }

  @ApiOperation({ summary: '소셜 로그인' })
  @Public()
  @Get('login/:socialProvider')
  async loginWithSocialProvider(
    @Query() userLoginInformationDto: SocialLoginInformationPayloadDto,
    @Param('socialProvider') socialProvider: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const url = await this.authService.loginWithSocialProvider(req.realIp, userLoginInformationDto, socialProvider as SocialProvider);
    res.redirect(url.toString());
  }

  @ApiOperation({ summary: '소셜 로그인 콜백' })
  @Public()
  @Transactional()
  @Get('login/:socialProvider/callback')
  async loginWithSocialProviderCallback(
    @Query() query: Record<string, string>,
    @Param('socialProvider') socialProvider: string,
    @Res() res: Response,
  ) {
    const secretConfig = this.commonConfig.getConfig('secret');
    const domain = this.commonConfig.getConfig('common').domain;
    const idToken = await this.authService.loginWithSocialProviderCallback(query, socialProvider as SocialProvider);

    const token = await this.authService.socialLogin(idToken, socialProvider as SocialProvider, query);

    res.cookie(CookieNameType.Access, token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieAccessExpireTime,
      domain: IS_PROD ? domain : undefined,
    });

    res.cookie(CookieNameType.Refresh, token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieRefreshExpireTime,
      domain: IS_PROD ? domain : undefined,
    });

    res.cookie(CookieNameType.Session, token.hmacSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieSessionExpireTime,
      domain: IS_PROD ? domain : undefined,
    });

    if (query.state) {
      const decodedState = Buffer.from(query.state, 'base64url').toString('utf8');
      const { redirect, action } = JSON.parse(decodedState);

      if (redirect && action === 'view') {
        res.redirect(`${CLIENT_URL}${redirect}`);
        return;
      }
    }
    res.redirect(`${CLIENT_URL}/auth/login`);
  }

  @ApiOperation({ summary: '리프레시' })
  @CombineResponses(HttpStatus.OK, RefreshResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationExceptionDto)
  @RequiredLogin
  @Public()
  @Post('refresh')
  async refresh(@RefreshToken() verifiedRefreshToken: string, @Res({ passthrough: true }) res: Response): Promise<RefreshResponseDto> {
    const secretConfig = this.commonConfig.getConfig('secret');
    const domain = this.commonConfig.getConfig('common').domain;
    const token = await this.authService.refresh(verifiedRefreshToken);

    res.cookie(CookieNameType.Access, token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieAccessExpireTime,
      domain: IS_PROD ? domain : undefined,
    });

    res.cookie(CookieNameType.Refresh, token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieRefreshExpireTime,
      // jwt는 s단위, cookie는 ms단위이기 때문에 1000을 곱해줌
      domain: IS_PROD ? domain : undefined,
    });

    res.cookie(CookieNameType.Session, token.hmacSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieSessionExpireTime,
      // jwt는 s단위, cookie는 ms단위이기 때문에 1000을 곱해줌
      domain: IS_PROD ? domain : undefined,
    });

    /* 액세스 토큰만 반환 - 프론트에서 localStorage 사용 */
    const { refreshToken, ...onlyAccessToken } = token;
    return new RefreshResponseDto(onlyAccessToken);
  }

  @ApiOperation({ summary: '로그아웃' })
  @CombineResponses(HttpStatus.OK, LogoutResponseDto, AlreadyLoggedOutResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationExceptionDto)
  @RequiredLogin
  @Public()
  @Post('logout')
  async logout(
    @LoginUser() loginUserData: LoginUserData,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    const secretConfig = this.commonConfig.getConfig('secret');
    const domain = this.commonConfig.getConfig('common').domain;

    res.clearCookie(CookieNameType.Access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieAccessExpireTime,
      domain: IS_PROD ? domain : undefined,
    });

    res.clearCookie(CookieNameType.Refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieRefreshExpireTime,
      domain: IS_PROD ? domain : undefined,
    });

    res.clearCookie(CookieNameType.Session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: secretConfig.cookieSessionExpireTime,
      domain: IS_PROD ? domain : undefined,
    });

    if (loginUserData) {
      await this.authService.logout(loginUserData, req.realIp);
    } else {
      return new AlreadyLoggedOutResponseDto();
    }
    return new LogoutResponseDto();
  }

  @ApiOperation({ summary: '세션 검증' })
  @CombineResponses(HttpStatus.OK, VerifySessionResponseDto)
  @RequiredSession()
  @Public()
  @Post('session')
  verifySession(@LoginSession() session: string): VerifySessionResponseDto {
    const verifyToken = this.authService.verifyHmacSession(session);
    return new VerifySessionResponseDto({ verified: !!verifyToken });
  }

  @ApiOperation({ summary: '토큰 검증' })
  @CombineResponses(HttpStatus.OK, VerifyTokenResponseDto)
  @RequiredLogin
  @Post('verify')
  verifyToken(@LoginToken() token: string): VerifyTokenResponseDto {
    const verifyToken = this.authService.verifyToken(token);

    return new VerifyTokenResponseDto({ verified: verifyToken, token });
  }

  @ApiOperation({ summary: '초대 토큰 검증' })
  @CombineResponses(HttpStatus.OK, VerifyInvitationTokenResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, AlreadyJoinedUserExceptionDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundOrganizationRoleExceptionDto, NotFoundNotificationExceptionDto)
  @Transactional()
  @RequiredLogin
  @Post('verify/invitation')
  async verifyInvitationToken(
    @LoginUser() user: LoginUserData,
    @Body() verifyInvitationTokenDto: VerifyInvitationTokenPayloadDto,
  ): Promise<VerifyInvitationTokenResponseDto> {
    const verifyToken = await this.authService.verifyInvitationToken(verifyInvitationTokenDto.token, user.id);
    return new VerifyInvitationTokenResponseDto({ verified: verifyToken, token: verifyInvitationTokenDto.token });
  }

  @ApiOperation({ summary: 'CSRF 토큰 생성' })
  @CombineResponses(HttpStatus.OK, CsrfTokenResponseDto)
  @Public()
  @Post('csrftoken')
  async csrfToken(): Promise<CsrfTokenResponseDto> {
    const token = this.authService.csrfToken();
    console.log('🚀 ~ AuthController ~ csrfToken ~ token:', token);
    return new CsrfTokenResponseDto({ token });
  }

  @ApiOperation({ summary: '비밀번호 재설정 이메일 전송' })
  @CombineResponses(HttpStatus.OK, ResetPasswordSendResponseDto)
  @Public()
  @Post('reset-password/send')
  async resetPasswordSend(@Body() resetPasswordDto: ResetPasswordSendPayloadDto): Promise<ResetPasswordSendResponseDto> {
    console.log('🚀 ~ AuthController ~ resetPasswordSend ~ resetPasswordDto:', resetPasswordDto);
    const verifyToken = await this.authService.resetPasswordSend(resetPasswordDto);
    return new ResetPasswordSendResponseDto({ token: verifyToken });
  }

  @ApiOperation({ summary: '비밀번호 재설정 인증' })
  @CombineResponses(HttpStatus.OK, ResetPasswordVerifyResponseDto)
  @Public()
  @Post('reset-password/verify')
  async resetPasswordVerify(@Body() resetPasswordVerifyDto: ResetPasswordVerifyPayloadDto): Promise<ResetPasswordVerifyResponseDto> {
    await this.authService.resetPasswordVerify(resetPasswordVerifyDto);
    return new ResetPasswordVerifyResponseDto();
  }

  @ApiOperation({ summary: '비밀번호 재설정' })
  @CombineResponses(HttpStatus.OK, ResetPasswordResponseDto)
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordPayloadDto, @Req() req: Request): Promise<ResetPasswordResponseDto> {
    await this.authService.resetPassword(resetPasswordDto, req.realIp);
    return new ResetPasswordResponseDto();
  }
}
