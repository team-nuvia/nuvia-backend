import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { NoMatchUserInformationException } from '@common/dto/exception/no-match-user-info.exception';
import { UnauthorizedException } from '@common/dto/response/exception.interface';
import { Body, Controller, HttpStatus, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BodyChangePasswordDto } from './dto/change-password-form.payload.dto';
import { UpdateUserSecretResponse } from './response/update-user-secret.response';
import { UserSecretsService } from './user-secrets.service';

@ApiTags('사용자 보안')
@RequiredLogin()
@Controller('secrets')
export class UserSecretsController {
  constructor(private readonly userSecretsService: UserSecretsService) {}

  @ApiOperation({ summary: '비밀번호 변경' })
  @Put()
  @CombineResponses(HttpStatus.OK, UpdateUserSecretResponse)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  changePassword(@LoginUser() user: LoginUserData, @Body() changePasswordDto: BodyChangePasswordDto) {
    return this.userSecretsService.changePassword(user.id, changePasswordDto);
  }
}
