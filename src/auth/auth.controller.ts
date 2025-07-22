import { LoginTokenNestedResponseDto } from '@auth/dto/response/login-token.nested.response.dto';
import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginToken } from '@common/decorator/login-token.param.decorator';
import { Public } from '@common/decorator/public.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { NoMatchUserInformationException } from '@common/dto/exception/no-match-user-info.exception.dto';
import { NotFoundUserException } from '@common/dto/exception/not-found-user.exception.dto';
import { Controller, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { VerifyTokenResponseDto } from './dto/response/verify-token.response.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  @CombineResponses(HttpStatus.OK, LoginResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserException)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationException)
  async login(@Req() req: Request /* @Body() loginDto: LoginFormPayloadDto */): Promise<LoginTokenNestedResponseDto> {
    console.log('🚀 ~ AuthController ~ login ~ req:', req.user);
    const token = await this.authService.login(req.user);
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
