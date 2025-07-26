import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { NoMatchUserInformationException } from '@common/dto/exception/no-match-user-info.exception.dto';
import { UnauthorizedException } from '@common/dto/response/exception.interface';
import { Body, Controller, HttpStatus, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangePasswordFormPayloadDto } from './dto/payload/change-password-form.payload.dto';
import { UpdateUserSecretResponseDto } from './dto/response/update-user-secret.response.dto';
import { UserSecretsService } from './user-secrets.service';

@RequiredLogin
@ApiTags('사용자 보안')
@Controller('secrets')
export class UserSecretsController {
  constructor(private readonly userSecretsService: UserSecretsService) {}

  @ApiOperation({ summary: '비밀번호 변경' })
  @Patch()
  @CombineResponses(HttpStatus.OK, UpdateUserSecretResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, NoMatchUserInformationException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  async changePassword(@LoginUser() user: LoginUserData, @Body() changePasswordDto: ChangePasswordFormPayloadDto) {
    await this.userSecretsService.changePassword(user.id, changePasswordDto);
    return new UpdateUserSecretResponseDto();
  }
}
