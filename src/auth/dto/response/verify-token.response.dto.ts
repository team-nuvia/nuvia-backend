import { VerifyTokenNestedResponseDto } from '@auth/dto/response/verify-token.nested.response.dto';
import { SuccessResponse } from '@common/dto/response';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenResponseDto extends SuccessResponse {
  @ApiProperty({ name: 'message', type: String, example: '토큰 검증 성공' })
  message: string = '토큰 검증 성공';

  constructor(payload: VerifyTokenNestedResponseDto) {
    super(HttpStatus.OK, payload);
  }
}
