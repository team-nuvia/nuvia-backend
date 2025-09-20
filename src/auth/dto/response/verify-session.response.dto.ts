import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { VerifySessionNestedResponseDto } from './verify-session.nested.response.dto';

export class VerifySessionResponseDto extends SuccessResponse<VerifySessionNestedResponseDto> {
  @ApiProperty({ description: '세션 검증 결과', example: ErrorMessage.SUCCESS_VERIFY_SESSION })
  message: string = ErrorMessage.SUCCESS_VERIFY_SESSION;

  @ApiProperty({ description: '세션 검증 성공', type: () => VerifySessionNestedResponseDto })
  declare payload: VerifySessionNestedResponseDto;

  constructor(payload: VerifySessionNestedResponseDto = new VerifySessionNestedResponseDto()) {
    super(payload);
  }
}
