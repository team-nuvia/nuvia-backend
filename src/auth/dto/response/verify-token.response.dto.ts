import { SetProperty } from '@common/decorator/set-property.decorator';
import { SuccessResponse } from '@common/dto/response';
import { HttpStatus } from '@nestjs/common';

export class VerifyTokenResponseDto extends SuccessResponse {
  @SetProperty({
    description: '토큰 검증 성공',
    value: '토큰 검증 성공',
  })
  message: string = '토큰 검증 성공';

  @SetProperty({
    description: '토큰 검증 성공',
    value: true,
  })
  payload: boolean = true;

  constructor(payload: boolean) {
    super(HttpStatus.OK, payload);
  }
}
