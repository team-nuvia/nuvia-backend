import { LoginTokenNestedResponseDto } from '@auth/dto/response/login-token.nested.response.dto';
import { SetProperty } from '@common/decorator/set-property.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { HttpStatus } from '@nestjs/common';

export class LoginResponseDto extends SuccessResponse {
  @SetProperty({
    description: '로그인 성공',
    value: '로그인 성공',
  })
  message: string = '로그인 성공';

  @SetProperty({
    description: '토큰',
    value: LoginTokenNestedResponseDto,
  })
  payload: LoginTokenNestedResponseDto = new LoginTokenNestedResponseDto();

  constructor(payload: LoginTokenNestedResponseDto) {
    super(HttpStatus.OK, payload);
    if (payload) this.payload = payload;
  }
}
