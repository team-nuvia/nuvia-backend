import { LoginTokenNestedResponseDto } from '@auth/dto/response/login-token.nested.response.dto';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto extends SuccessResponse {
  @ApiProperty({ description: '로그인 성공', example: '로그인 성공' })
  message: string = '로그인 성공';

  @ApiProperty({ description: '토큰', type: LoginTokenNestedResponseDto })
  declare payload: LoginTokenNestedResponseDto;
}
