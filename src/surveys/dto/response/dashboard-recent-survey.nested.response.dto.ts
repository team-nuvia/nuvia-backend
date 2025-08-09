import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';

export class DashboardRecentSurveyNestedResponseDto {
  @ApiProperty({ description: '설문 ID', example: 1 })
  id!: number;

  @ApiProperty({ description: '설문 제목', example: '고객 만족도 조사' })
  title!: string;

  @ApiProperty({ description: '설문 설명', nullable: true, example: '서비스 개선을 위한 고객 만족도 조사입니다.' })
  description!: string | null;

  @ApiProperty({ description: '설문 상태', example: SurveyStatus.Active })
  status!: SurveyStatus;

  @ApiProperty({ description: '응답자 수', example: 10 })
  responses!: number;

  @ApiProperty({ description: '생성일시', example: '2024-01-15T09:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ description: '수정일시', example: '2024-01-15T09:00:00.000Z' })
  updatedAt!: Date;
}
