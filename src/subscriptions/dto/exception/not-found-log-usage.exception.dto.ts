import { ErrorKey, ErrorMessage, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundLogUsageExceptionDto extends NotFoundException {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.NOT_FOUND_LOG_USAGE,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_LOG_USAGE, reason });
  }
}
