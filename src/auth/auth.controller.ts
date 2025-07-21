import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginToken } from '@common/decorator/login-token.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { NoMatchUserInformationException } from '@common/dto/exception/no-match-user-info.exception';
import { NotFoundUserException } from '@common/dto/exception/not-found-user.exception';
import { LoginTokenNestedResponseDto } from '@auth/dto/response/login-token.nested.response.dto';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginFormPayloadDto } from './dto/payload/login-form.payload.dto';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { VerifyTokenResponseDto } from './dto/response/verify-token.response.dto';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  @CombineResponses(HttpStatus.OK, LoginResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserException)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationException)
  async login(@Body() loginDto: LoginFormPayloadDto): Promise<LoginTokenNestedResponseDto> {
    const token = await this.authService.login(loginDto);
    return token;
  }

  @ApiOperation({ summary: '토큰 검증' })
  @CombineResponses(HttpStatus.OK, VerifyTokenResponseDto)
  @Post('verify')
  @RequiredLogin()
  verifyToken(@LoginToken() token: string) {
    return this.authService.verifyToken(token);
  }
}
