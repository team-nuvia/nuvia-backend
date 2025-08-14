import { ErrorKey, ErrorMessage, ForbiddenException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NoMatchSubscriptionExceptionDto extends ForbiddenException {
  @ApiProperty({
    example: ErrorMessage.NO_MATCH_SUBSCRIPTION,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NO_MATCH_SUBSCRIPTION, reason });
  }
}
