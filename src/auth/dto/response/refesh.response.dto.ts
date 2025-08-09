import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LoginTokenNestedResponseDto } from './login-token.nested.response.dto';

export class OnlyAccessToken extends OmitType(LoginTokenNestedResponseDto, ['refreshToken']) {}

export class RefreshResponseDto extends SuccessResponse<OnlyAccessToken> {
  @ApiProperty({
    example: ErrorMessage.SUCCESS_REFRESH,
  })
  message: string = ErrorMessage.SUCCESS_REFRESH;

  @ApiProperty({
    description: '토큰',
    type: () => OnlyAccessToken,
  })
  declare payload: OnlyAccessToken;

  constructor(payload: OnlyAccessToken = new OnlyAccessToken()) {
    super(payload);
  }
}
