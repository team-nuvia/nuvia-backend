import { SetProperty } from '@common/decorator/set-property.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { HttpStatus } from '@nestjs/common';

export class LogoutResponseDto extends SuccessResponse {
  @SetProperty({
    description: '로그아웃 성공',
    value: '로그아웃 성공',
  })
  message: string = '로그아웃 성공';

  @SetProperty({
    description: '토큰',
    value: null,
  })
  payload: null = null;

  constructor() {
    super(HttpStatus.OK, null);
  }
}
