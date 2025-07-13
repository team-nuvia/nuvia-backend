import { SetProperty } from '@common/decorator/set-property.decorator';
import { PayloadLoginTokenDto } from '@common/dto/payload/payload-login-token.dto';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { HttpStatus } from '@nestjs/common';

export class LoginResponse extends SuccessResponse {
  @SetProperty({
    description: '토큰',
    value: PayloadLoginTokenDto,
  })
  payload: PayloadLoginTokenDto = new PayloadLoginTokenDto();

  // @ApiProperty({
  //   description: '로그인 성공',
  //   type: String,
  //   example: '로그인 성공',
  // })
  @SetProperty({
    description: '로그인 성공',
    value: '로그인 성공',
  })
  message: string = '로그인 성공';

  constructor(payload: PayloadLoginTokenDto) {
    super(HttpStatus.OK, payload);
  }
}
