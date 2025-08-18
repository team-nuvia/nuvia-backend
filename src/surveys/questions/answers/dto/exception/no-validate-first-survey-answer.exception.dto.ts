import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NoValidateFirstSurveyAnswerExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '예외 메시지',
    example: ErrorMessage.NO_VALIDATE_FIRST_SURVEY_ANSWER,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NO_VALIDATE_FIRST_SURVEY_ANSWER, reason });
  }
}
