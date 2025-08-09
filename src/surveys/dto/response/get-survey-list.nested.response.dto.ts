import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';

export class GetSurveyListNestedResponseDto {
  @ApiProperty({ description: '설문 ID', example: 1 })
  id!: number;

  @ApiProperty({ description: '설문 제목', example: '고객 만족도 조사' })
  title!: string;

  @ApiProperty({ description: '설문 설명', example: '고객 만족도 조사 설명' })
  description!: string | null;

  @ApiProperty({ description: '설문 고유 키', example: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' })
  hashedUniqueKey!: string;

  @ApiProperty({ description: '설문 카테고리', example: '고객 만족도 조사' })
  category!: string;

  @ApiProperty({ description: '설문 공개 여부', example: true })
  isPublic!: boolean;

  @ApiProperty({ description: '설문 상태', example: SurveyStatus.Active })
  status!: SurveyStatus;

  @ApiProperty({ description: '설문 조회 수', example: 10 })
  viewCount!: number;

  @ApiProperty({ description: '설문 예상 소요 시간', example: 10 })
  estimatedTime!: number;

  @ApiProperty({ description: '설문 질문 수', example: 10 })
  questionAmount!: number;

  @ApiProperty({ description: '설문 응답자 수', example: 10 })
  responseAmount!: number;

  @ApiProperty({ description: '설문 생성일시', example: '2024-01-15T09:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ description: '설문 수정일시', example: '2024-01-15T09:00:00.000Z' })
  updatedAt!: Date;
}
