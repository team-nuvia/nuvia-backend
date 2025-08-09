import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginToken } from '@common/decorator/login-token.param.decorator';
import { Public } from '@common/decorator/public.decorator';
import { RefreshToken } from '@common/decorator/refresh-token.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { NoMatchUserInformationExceptionDto } from '@common/dto/exception/no-match-user-info.exception.dto';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { LogoutResponseDto } from './dto/response/logout.response.dto';
import { RefreshResponseDto } from './dto/response/refesh.response.dto';
import { VerifyTokenResponseDto } from './dto/response/verify-token.response.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiOperation({ summary: '로그인' })
  @CombineResponses(HttpStatus.OK, LoginResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationExceptionDto)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto> {
    const token = await this.authService.login(req.user);

    /* 리프레시만 쿠키 저장 */
    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    /* 액세스 토큰만 반환 - 프론트에서 localStorage 사용 */
    const { refreshToken, ...onlyAccessToken } = token;
    return new LoginResponseDto(onlyAccessToken);
  }

  @ApiOperation({ summary: '리프레시' })
  @CombineResponses(HttpStatus.OK, RefreshResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationExceptionDto)
  @RequiredLogin
  @Public()
  @Post('refresh')
  async refresh(@RefreshToken() verifiedRefreshToken: string, @Res({ passthrough: true }) res: Response): Promise<RefreshResponseDto> {
    const token = await this.authService.refresh(verifiedRefreshToken);

    /* 리프레시만 쿠키 저장 */
    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    /* 액세스 토큰만 반환 - 프론트에서 localStorage 사용 */
    const { refreshToken, ...onlyAccessToken } = token;
    return new RefreshResponseDto(onlyAccessToken);
  }

  @ApiOperation({ summary: '로그아웃' })
  @CombineResponses(HttpStatus.OK, LogoutResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationExceptionDto)
  @RequiredLogin
  @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<LogoutResponseDto> {
    res.clearCookie('refresh_token');
    return new LogoutResponseDto();
  }

  @ApiOperation({ summary: '토큰 검증' })
  @CombineResponses(HttpStatus.OK, VerifyTokenResponseDto)
  @RequiredLogin
  @Post('verify')
  verifyToken(@LoginToken() token: string): VerifyTokenResponseDto {
    const verifyToken = this.authService.verifyToken(token);
    return new VerifyTokenResponseDto({ verified: verifyToken });
  }
}
