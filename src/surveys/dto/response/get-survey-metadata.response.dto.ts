import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { MetadataDashboardSurveryNestedResponseDto } from './metadata-dashboard-survery.nested.dto';
import { MetadataSurveyListNestedResponseDto } from './metadata-survey-list.nested.response.dto';

export class GetSurveyMetadataResponseDto extends GetResponse<MetadataDashboardSurveryNestedResponseDto | MetadataSurveyListNestedResponseDto> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_SURVEY_METADATA })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY_METADATA;

  @ApiProperty({ description: '설문 메타데이터', type: () => MetadataDashboardSurveryNestedResponseDto })
  declare payload: MetadataDashboardSurveryNestedResponseDto | MetadataSurveyListNestedResponseDto;

  constructor(
    data: MetadataDashboardSurveryNestedResponseDto | MetadataSurveyListNestedResponseDto = new MetadataDashboardSurveryNestedResponseDto(),
  ) {
    super(data);
  }
}
