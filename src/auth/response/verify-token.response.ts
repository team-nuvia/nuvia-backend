import { PayloadVerifyTokenDto } from '@common/dto/payload/payload-verify-token.dto';
import { SuccessResponse } from '@common/dto/response';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenResponse extends SuccessResponse {
  @ApiProperty({ name: 'message', type: String, example: '토큰 검증 성공' })
  message: string = '토큰 검증 성공';

  constructor(payload: PayloadVerifyTokenDto) {
    super(HttpStatus.OK, payload);
  }
}
