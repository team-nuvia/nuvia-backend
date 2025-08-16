import { ErrorMessage, GetResponse } from '@common/dto/response';
import { PaginatedResponseDto } from '@common/interface/paginated.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GetSurveyBinPaginatedNestedResponseDto } from './get-survey-bin-paginated.nested.response.dto';

export class GetSurveyBinPaginatedResponseDto implements PaginatedResponseDto<GetSurveyBinPaginatedNestedResponseDto> {
  @ApiProperty({ description: '페이지', example: 1 })
  page: number = 1;

  @ApiProperty({ description: '페이지 크기', example: 10 })
  limit: number = 10;

  @ApiProperty({ description: '총 설문 개수', example: 100 })
  total: number = 100;

  @ApiProperty({ description: '삭제된 설문 데이터', type: () => GetSurveyBinPaginatedNestedResponseDto, isArray: true })
  data: GetSurveyBinPaginatedNestedResponseDto[] = [new GetSurveyBinPaginatedNestedResponseDto()];
}

export class GetSurveyBinResponseDto extends GetResponse<GetSurveyBinPaginatedResponseDto> {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.SUCCESS_GET_SURVEY_BIN,
  })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY_BIN;

  @ApiProperty({
    description: '삭제된 설문 데이터',
    type: () => GetSurveyBinPaginatedResponseDto,
    isArray: true,
  })
  declare payload: GetSurveyBinPaginatedResponseDto;

  constructor(payload: GetSurveyBinPaginatedResponseDto = new GetSurveyBinPaginatedResponseDto()) {
    super(payload);
  }
}
