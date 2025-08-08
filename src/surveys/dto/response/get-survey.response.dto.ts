import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { DashboardSurveyNestedResponseDto } from './dashboard-survey.nested.response.dto';

export class GetSurveyResponseDto extends GetResponse<DashboardSurveyNestedResponseDto[]> {
  @ApiProperty({
    description: '설문 메시지',
    example: ErrorMessage.SUCCESS_GET_SURVEY,
  })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY;

  @ApiProperty({
    description: '설문 데이터',
    type: () => DashboardSurveyNestedResponseDto,
    isArray: true,
  })
  declare payload: DashboardSurveyNestedResponseDto[];

  constructor(payload: DashboardSurveyNestedResponseDto[] = [new DashboardSurveyNestedResponseDto()]) {
    super(payload);
  }
}
