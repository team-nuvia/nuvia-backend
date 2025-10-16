import { ApiProperty } from '@nestjs/swagger';

export class OverviewStatesResponseDto {
  @ApiProperty({ description: '총 응답 수', example: 100 })
  totalResponses: number = 100;

  @ApiProperty({ description: '평균 응답 수', example: 36 })
  avgResponsesPerSurvey: number = 36;

  @ApiProperty({ description: '30일 성장율(0 ~ 1)', example: 0.1 })
  growth30dRate: number = 0.1;

  @ApiProperty({ description: '완료율(0 ~ 1)', example: 0.5 })
  completionRate: number = 0.5;
}
