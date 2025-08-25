import { ErrorKey, ErrorMessage, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundAnswerExceptionDto extends NotFoundException {
  @ApiProperty({
    description: '존재하지 않는 답변입니다.',
    example: ErrorMessage.NOT_FOUND_ANSWER,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_ANSWER, reason });
  }
}
