import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSurveyStatusResponseDto extends SuccessResponse<null> {
  @ApiProperty({
    description: '설문 메시지',
    example: ErrorMessage.SUCCESS_UPDATE_SURVEY_STATUS,
  })
  message: string = ErrorMessage.SUCCESS_UPDATE_SURVEY_STATUS;
}
