import { ErrorKey, ErrorMessage, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundSurveyExceptionDto extends NotFoundException {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.NOT_FOUND_SURVEY,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_SURVEY, reason });
  }
}
