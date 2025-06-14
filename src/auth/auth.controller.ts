import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginToken } from '@common/decorator/login-token.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { LoginTokenDto } from '@common/dto/dsl-login';
import { ApiDocs } from '@common/variable/dsl';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  @CombineResponses(HttpStatus.OK, ApiDocs.DslLogin)
  @CombineResponses(HttpStatus.NOT_FOUND, ApiDocs.DslNotFoundEmail)
  @CombineResponses(HttpStatus.BAD_REQUEST, ApiDocs.DslBadRequest)
  async login(@Body() loginDto: LoginDto): Promise<LoginTokenDto> {
    const token = await this.authService.login(loginDto);
    return token;
  }

  @ApiOperation({ summary: '토큰 검증' })
  @Post('verify')
  @RequiredLogin()
  verifyToken(@LoginToken() token: string) {
    return this.authService.verifyToken(token);
  }
}
