import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class AlreadyAnswerStartedExceptionDto extends BadRequestException {
  @ApiProperty({
    example: ErrorMessage.ALREADY_ANSWER_STARTED,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ALREADY_ANSWER_STARTED, reason });
  }
}
