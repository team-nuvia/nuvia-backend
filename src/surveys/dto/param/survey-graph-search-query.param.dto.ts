import { IsDateOnlyString } from '@common/decorator/is-date-only-string.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SurveyGraphType } from '@share/enums/survey-graph-type';
import { IsEnum, IsOptional } from 'class-validator';

export class SurveyGraphSearchQueryParamDto {
  @ApiPropertyOptional({
    enum: SurveyGraphType,
    description: '그래프 타입',
    example: SurveyGraphType.Weekly,
  })
  @IsEnum(SurveyGraphType)
  @IsOptional()
  type?: SurveyGraphType;

  @ApiProperty({
    description: '시작 날짜',
    example: '2025-01-01',
  })
  @IsDateOnlyString()
  startDate!: string;

  @ApiProperty({
    description: '종료 날짜',
    example: '2025-01-01',
  })
  @IsDateOnlyString()
  endDate!: string;
}
