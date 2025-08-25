import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { MetadataDashboardSurveyNestedResponseDto } from './metadata-dashboard-survey.nested.dto';
import { MetadataSurveyListNestedResponseDto } from './metadata-survey-list.nested.response.dto';

export class GetSurveyMetadataResponseDto extends GetResponse<MetadataDashboardSurveyNestedResponseDto | MetadataSurveyListNestedResponseDto> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_SURVEY_METADATA })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY_METADATA;

  @ApiProperty({ description: '설문 메타데이터', type: () => MetadataDashboardSurveyNestedResponseDto })
  declare payload: MetadataDashboardSurveyNestedResponseDto | MetadataSurveyListNestedResponseDto;

  constructor(data: MetadataDashboardSurveyNestedResponseDto | MetadataSurveyListNestedResponseDto = new MetadataDashboardSurveyNestedResponseDto()) {
    super(data);
  }
}
