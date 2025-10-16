import { ApiProperty } from '@nestjs/swagger';
import { DailyTrendResponseDto } from './daily-trend.response.dto';
import { OverviewStatesResponseDto } from './overview-states.response.dto';

export class OverviewAnalysisNestedResponseDto {
  @ApiProperty({ description: '설문 ID', example: 12 })
  surveyId: number = 12;

  @ApiProperty({ description: '설문 제목', example: '설문 제목' })
  title: string = '설문 제목';

  @ApiProperty({ description: '기간 라벨', example: '2024-01-01 ~ 2024-01-31' })
  periodLabel: string = '2024-01-01 ~ 2024-01-31';

  @ApiProperty({ description: '통계 정보', type: () => OverviewStatesResponseDto, example: new OverviewStatesResponseDto() })
  stats: OverviewStatesResponseDto = new OverviewStatesResponseDto();

  @ApiProperty({
    description: '일별 트렌드',
    type: () => DailyTrendResponseDto,
    isArray: true,
    example: [new DailyTrendResponseDto()],
  })
  dailyTrend: DailyTrendResponseDto[] = [];
}
