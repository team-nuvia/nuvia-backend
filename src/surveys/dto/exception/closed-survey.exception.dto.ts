import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ClosedSurveyExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.CLOSED_SURVEY,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.CLOSED_SURVEY, reason });
  }
}
