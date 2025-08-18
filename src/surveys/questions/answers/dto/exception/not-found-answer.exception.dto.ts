import { ErrorCode, ErrorMessage, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundAnswerExceptionDto extends NotFoundException {
  @ApiProperty({
    description: '존재하지 않는 답변입니다.',
    example: ErrorMessage.NOT_FOUND_ANSWER,
  })
  message = ErrorMessage.NOT_FOUND_ANSWER;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorCode.NOT_FOUND_ANSWER, reason });
  }
}
