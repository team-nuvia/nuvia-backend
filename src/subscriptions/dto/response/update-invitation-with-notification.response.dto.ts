import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInvitationWithNotificationResponseDto extends SuccessResponse<null> {
  @ApiProperty({ description: '에러 메시지', example: ErrorMessage.SUCCESS_UPDATE_INVITATION_WITH_NOTIFICATION })
  message: string = ErrorMessage.SUCCESS_UPDATE_INVITATION_WITH_NOTIFICATION;
}
