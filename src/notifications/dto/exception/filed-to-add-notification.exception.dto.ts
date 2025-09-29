import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class FailedToAddNotificationExceptionDto extends BadRequestException {
  @ApiProperty({ description: '메시지', example: ErrorMessage.FAILED_TO_ADD_NOTIFICATION })
  declare message: string;

  constructor() {
    super({ code: ErrorKey.FAILED_TO_ADD_NOTIFICATION, reason: ErrorMessage.FAILED_TO_ADD_NOTIFICATION });
  }
}
