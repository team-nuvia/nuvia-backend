import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ExpiredAnswerExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '예외 메시지',
    example: ErrorMessage.EXPIRED_ANSWER,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.EXPIRED_ANSWER, reason });
  }
}
