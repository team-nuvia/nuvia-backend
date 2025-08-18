import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessValidateFirstSurveyAnswerResponseDto extends SuccessResponse<void> {
  @ApiProperty({
    description: '성공 메시지',
    example: ErrorMessage.SUCCESS_VALIDATE_FIRST_SURVEY_ANSWER,
  })
  message: string = ErrorMessage.SUCCESS_VALIDATE_FIRST_SURVEY_ANSWER;
}
