import { PlanNameType } from '@/plans/enums/plan-name-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PlanUsageNestedResponseDto {
  @ApiProperty({ description: '플랜 타입', example: PlanNameType.Free, enum: PlanNameType })
  plan!: PlanNameType;

  @ApiProperty({ description: '월간 사용량', example: 3 })
  usage!: number;

  @ApiProperty({ description: '월간 제한량', example: 10 })
  limit!: number;
}

export class RespondentIncreaseRateNestedResponseDto {
  @ApiProperty({ description: '이전 월 응답자 수', example: 10 })
  previousMonthRespondentCount!: number;

  @ApiProperty({ description: '현재 월 응답자 수', example: 15 })
  currentMonthRespondentCount!: number;
}

export class DashboardSurveryMetadataNestedResponseDto {
  @ApiProperty({ description: '총 설문 수', example: 5 })
  totalSurveyCount!: number;

  @ApiProperty({ description: '총 응답자 수', example: 25 })
  totalRespondentCount!: number;

  @ApiProperty({ description: '응답자 증가율', type: () => RespondentIncreaseRateNestedResponseDto })
  respondentIncreaseRate!: RespondentIncreaseRateNestedResponseDto;

  @ApiProperty({ description: '플랜 사용량', type: () => PlanUsageNestedResponseDto })
  planUsage!: PlanUsageNestedResponseDto;
}
