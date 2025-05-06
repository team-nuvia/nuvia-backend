import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Body, Controller, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserSecretsService } from './user-secrets.service';

@ApiTags('사용자 보안')
@RequiredLogin()
@Controller('secrets')
export class UserSecretsController {
  constructor(private readonly userSecretsService: UserSecretsService) {}

  @Put()
  changePassword(
    @LoginUser() user: LoginUserData,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userSecretsService.changePassword(user.id, changePasswordDto);
  }
}
