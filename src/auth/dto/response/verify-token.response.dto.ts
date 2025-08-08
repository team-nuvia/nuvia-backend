import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { VerifyTokenNestedResponseDto } from './verify-token.nested.response.dto';

export class VerifyTokenResponseDto extends SuccessResponse<VerifyTokenNestedResponseDto> {
  @ApiProperty({ example: ErrorMessage.VERIFY_TOKEN_SUCCESS })
  message: string = ErrorMessage.VERIFY_TOKEN_SUCCESS;

  @ApiProperty({ description: '토큰 검증 성공', type: () => VerifyTokenNestedResponseDto })
  declare payload: VerifyTokenNestedResponseDto;

  constructor(payload: VerifyTokenNestedResponseDto = new VerifyTokenNestedResponseDto()) {
    super(payload);
  }
}
