import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { ApiDocs } from '@common/variable/dsl';
import { Body, Controller, HttpStatus, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BodyChangePasswordDto } from './dto/body-change-password.dto';
import { UserSecretsService } from './user-secrets.service';

@ApiTags('사용자 보안')
@RequiredLogin()
@Controller('secrets')
export class UserSecretsController {
  constructor(private readonly userSecretsService: UserSecretsService) {}

  @ApiOperation({ summary: '비밀번호 변경' })
  @Put()
  @CombineResponses(HttpStatus.CREATED, ApiDocs.DslUpdateUserSecret)
  @CombineResponses(HttpStatus.BAD_REQUEST, ApiDocs.DslBadRequest)
  @CombineResponses(HttpStatus.UNAUTHORIZED, ApiDocs.DslUnauthorized)
  changePassword(
    @LoginUser() user: LoginUserData,
    @Body() changePasswordDto: BodyChangePasswordDto,
  ) {
    return this.userSecretsService.changePassword(user.id, changePasswordDto);
  }
}
