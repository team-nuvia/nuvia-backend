import { ErrorKey, ErrorMessage, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundNotificationExceptionDto extends NotFoundException {
  @ApiProperty({ description: '메시지', example: ErrorMessage.NOT_FOUND_NOTIFICATION })
  declare message: string;

  constructor() {
    super({ code: ErrorKey.NOT_FOUND_NOTIFICATION, reason: ErrorMessage.NOT_FOUND_NOTIFICATION });
  }
}
