import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { DashboardSurveryMetadataNestedResponseDto } from './dashboard-survery-metadata.nested.dto';

export class GetSurveyMetadataResponseDto extends GetResponse<DashboardSurveryMetadataNestedResponseDto> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_SURVEY_METADATA })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY_METADATA;

  @ApiProperty({ description: '설문 메타데이터', type: () => DashboardSurveryMetadataNestedResponseDto })
  declare payload: DashboardSurveryMetadataNestedResponseDto;

  constructor(data: DashboardSurveryMetadataNestedResponseDto = new DashboardSurveryMetadataNestedResponseDto()) {
    super(data);
  }
}
