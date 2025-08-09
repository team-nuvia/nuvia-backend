import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { DashboardRecentSurveyNestedResponseDto } from './dashboard-recent-survey.nested.response.dto';

export class GetRecentSurveyResponseDto extends GetResponse<DashboardRecentSurveyNestedResponseDto[]> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_GET_RECENT_SURVEY })
  message: string = ErrorMessage.SUCCESS_GET_RECENT_SURVEY;

  @ApiProperty({ description: '설문 목록', type: [DashboardRecentSurveyNestedResponseDto] })
  @IsArray()
  declare payload: DashboardRecentSurveyNestedResponseDto[];

  constructor(payload: DashboardRecentSurveyNestedResponseDto[] = [new DashboardRecentSurveyNestedResponseDto()]) {
    super(payload);
  }
}
