import { LoginTokenNestedResponseDto } from '@auth/dto/response/login-token.nested.response.dto';
import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class OnlyAccessToken extends OmitType(LoginTokenNestedResponseDto, ['refreshToken']) {}

export class LoginResponseDto extends GetResponse<OnlyAccessToken> {
  @ApiProperty({ description: '로그인 성공', example: '로그인 성공' })
  declare message: string;

  @ApiProperty({ description: '토큰', type: OnlyAccessToken })
  declare payload: OnlyAccessToken;
}
