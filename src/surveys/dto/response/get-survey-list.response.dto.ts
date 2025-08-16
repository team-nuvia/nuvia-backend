import { ErrorMessage, GetResponse } from '@common/dto/response';
import { PaginatedResponseDto } from '@common/interface/paginated.response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { GetSurveyListNestedResponseDto } from './get-survey-list.nested.response.dto';

export class ListResponseDto implements PaginatedResponseDto<GetSurveyListNestedResponseDto> {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  page!: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  limit!: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  total!: number;

  @ApiPropertyOptional({ type: () => GetSurveyListNestedResponseDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetSurveyListNestedResponseDto)
  data!: GetSurveyListNestedResponseDto[];

  constructor(
    page: number = 1,
    limit: number = 10,
    total: number = 0,
    data: GetSurveyListNestedResponseDto[] = [new GetSurveyListNestedResponseDto()],
  ) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.data = data;
  }
}

export class GetSurveyListResponseDto extends GetResponse<ListResponseDto> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_GET_SURVEY_LIST })
  message: string = ErrorMessage.SUCCESS_GET_SURVEY_LIST;

  @ApiProperty({ type: () => ListResponseDto })
  declare payload: ListResponseDto;

  constructor(payload: ListResponseDto = new ListResponseDto()) {
    super(payload);
  }
}
