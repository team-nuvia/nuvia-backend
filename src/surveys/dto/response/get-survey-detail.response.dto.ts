import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyDetailNestedResponseDto } from './survey-detail.nested.response.dto';

export class GetSurveyDetailResponseDto extends GetResponse<SurveyDetailNestedResponseDto> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_GET_SURVEY_DETAIL })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY_DETAIL;

  @ApiProperty({ description: '설문 상세 정보', type: () => SurveyDetailNestedResponseDto })
  declare payload: SurveyDetailNestedResponseDto;

  constructor(payload: SurveyDetailNestedResponseDto = new SurveyDetailNestedResponseDto()) {
    super(payload);
  }
}
