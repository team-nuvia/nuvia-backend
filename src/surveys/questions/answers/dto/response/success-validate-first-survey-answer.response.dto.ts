import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateFirstSurveyAnswerNestedResponseDto } from './validate-first-survey-answer.nested.response.dto';

export class SuccessValidateFirstSurveyAnswerResponseDto extends SuccessResponse<ValidateFirstSurveyAnswerNestedResponseDto> {
  @ApiProperty({
    description: '성공 메시지',
    example: ErrorMessage.SUCCESS_VALIDATE_FIRST_SURVEY_ANSWER,
  })
  message: string = ErrorMessage.SUCCESS_VALIDATE_FIRST_SURVEY_ANSWER;

  @ApiProperty({
    description: '첫 번째 질문 유효성 검사 여부',
    type: () => ValidateFirstSurveyAnswerNestedResponseDto,
  })
  declare payload: ValidateFirstSurveyAnswerNestedResponseDto;

  constructor(payload: ValidateFirstSurveyAnswerNestedResponseDto = new ValidateFirstSurveyAnswerNestedResponseDto()) {
    super();
    this.payload = payload;
  }
}
