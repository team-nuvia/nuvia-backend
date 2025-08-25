import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { GetSurveyGraphNestedResponseDto } from './get-survey-graph.nested.response.dto';

export class GetSurveyGraphResponseDto extends GetResponse<GetSurveyGraphNestedResponseDto[]> {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.SUCCESS_GET_SURVEY_GRAPH,
  })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY_GRAPH;

  @ApiProperty({
    description: '그래프 데이터',
    type: () => GetSurveyGraphNestedResponseDto,
    isArray: true,
    example: [new GetSurveyGraphNestedResponseDto()],
  })
  declare payload: GetSurveyGraphNestedResponseDto[];

  constructor(payload: GetSurveyGraphNestedResponseDto[] = [new GetSurveyGraphNestedResponseDto()]) {
    super(payload);
  }
}
