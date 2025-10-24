import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerOwnerMigratedExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '예외 메시지',
    example: ErrorMessage.ANSWER_OWNER_MIGRATED,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ANSWER_OWNER_MIGRATED, reason });
  }
}
