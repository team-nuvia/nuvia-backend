import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessInviteSubscriptionResponseDto extends SuccessResponse<null> {
  @ApiProperty({ description: '초대 메일 발송 성공', example: ErrorMessage.SUCCESS_INVITE_SUBSCRIPTION })
  message: string = ErrorMessage.SUCCESS_INVITE_SUBSCRIPTION;
}
