import { ErrorKey, ErrorMessage, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundSubscriptionExceptionDto extends NotFoundException {
  @ApiProperty({ description: '에러 메시지', example: ErrorMessage.NOT_FOUND_SUBSCRIPTION })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_SUBSCRIPTION, reason });
  }
}
