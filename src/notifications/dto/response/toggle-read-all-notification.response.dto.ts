import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleReadAllNotificationResponseDto extends SuccessResponse<null> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_TOGGLE_READ_ALL_NOTIFICATION })
  message: string = ErrorMessage.SUCCESS_TOGGLE_READ_ALL_NOTIFICATION;
}
