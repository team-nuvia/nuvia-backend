import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { VerifyTokenNestedResponseDto } from './verify-token.nested.response.dto';

export class VerifyInvitationTokenResponseDto extends SuccessResponse<VerifyTokenNestedResponseDto> {
  @ApiProperty({
    description: '초대 토큰 검증 결과',
    example: ErrorMessage.SUCCESS_VERIFY_INVITE_TOKEN,
  })
  message: string = ErrorMessage.SUCCESS_VERIFY_INVITE_TOKEN;

  @ApiProperty({
    description: '초대 토큰 검증 성공',
    type: () => VerifyTokenNestedResponseDto,
  })
  declare payload: VerifyTokenNestedResponseDto;

  constructor(payload: VerifyTokenNestedResponseDto = new VerifyTokenNestedResponseDto()) {
    super(payload);
  }
}
