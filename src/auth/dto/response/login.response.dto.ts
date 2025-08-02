import { ErrorMessage } from '@common/dto/response';
import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LoginTokenNestedResponseDto } from './login-token.nested.response.dto';

export class OnlyAccessToken extends OmitType(LoginTokenNestedResponseDto, ['refreshToken']) {}

export class LoginResponseDto extends GetResponse<OnlyAccessToken> {
  @ApiProperty({ example: ErrorMessage.LOGIN_SUCCESS })
  message: string = ErrorMessage.LOGIN_SUCCESS;

  @ApiProperty({ description: '토큰', type: () => OnlyAccessToken })
  declare payload: OnlyAccessToken;

  constructor(payload: OnlyAccessToken = new OnlyAccessToken()) {
    super(payload);
  }
}
