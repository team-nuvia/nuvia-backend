import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyDetailViewNestedResponseDto } from './survey-detail-view.nested.response.dto';

export class GetSurveyDetailViewResponseDto extends GetResponse<SurveyDetailViewNestedResponseDto> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_GET_SURVEY_DETAIL })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY_DETAIL;

  @ApiProperty({ description: '설문 상세 정보', type: () => SurveyDetailViewNestedResponseDto })
  declare payload: SurveyDetailViewNestedResponseDto;
}
