import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MetadataDashboardSurveyNestedResponseDto } from './metadata-dashboard-survey.nested.dto';
import { MetadataSurveyListNestedResponseDto } from './metadata-survey-list.nested.response.dto';

export class GetSurveyMetadataResponseDto extends GetResponse<MetadataDashboardSurveyNestedResponseDto> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_SURVEY_METADATA })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY_METADATA;

  @ApiProperty({
    description: '설문 메타데이터',
    type: () => MetadataDashboardSurveyNestedResponseDto,
    example: new MetadataDashboardSurveyNestedResponseDto(),
  })
  @Type(() => MetadataDashboardSurveyNestedResponseDto)
  declare payload: MetadataDashboardSurveyNestedResponseDto;

  constructor(data: MetadataDashboardSurveyNestedResponseDto = new MetadataDashboardSurveyNestedResponseDto()) {
    super(data);
  }
}

export class GetSurveyMetadataSurveyListResponseDto extends GetResponse<MetadataSurveyListNestedResponseDto> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_SURVEY_METADATA })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY_METADATA;

  @ApiProperty({
    description: '설문 메타데이터',
    type: () => MetadataSurveyListNestedResponseDto,
    example: new MetadataSurveyListNestedResponseDto(),
  })
  @Type(() => MetadataSurveyListNestedResponseDto)
  declare payload: MetadataSurveyListNestedResponseDto;

  constructor(data: MetadataSurveyListNestedResponseDto = new MetadataSurveyListNestedResponseDto()) {
    super(data);
  }
}
