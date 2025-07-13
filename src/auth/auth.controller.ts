import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginToken } from '@common/decorator/login-token.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { BodyLoginDto } from '@common/dto/body/body-login.dto';
import { NoMatchUserInformationException } from '@common/dto/exception/no-match-user-info.exception';
import { NotFoundUserException } from '@common/dto/exception/not-found-user.exception';
import { PayloadLoginTokenDto } from '@common/dto/payload/payload-login-token.dto';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponse } from './response/login.response';
import { VerifyTokenResponse } from './response/verify-token.response';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  @CombineResponses(HttpStatus.OK, LoginResponse)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserException)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationException)
  async login(@Body() loginDto: BodyLoginDto): Promise<PayloadLoginTokenDto> {
    const token = await this.authService.login(loginDto);
    return token;
  }

  @ApiOperation({ summary: '토큰 검증' })
  @CombineResponses(HttpStatus.OK, VerifyTokenResponse)
  @Post('verify')
  @RequiredLogin()
  verifyToken(@LoginToken() token: string) {
    return this.authService.verifyToken(token);
  }
}
