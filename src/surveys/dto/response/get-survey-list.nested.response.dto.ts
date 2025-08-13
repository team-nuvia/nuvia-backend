import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';
import { GetCategoryNestedResponseDto } from './get-category.nested.response.dto';

export class GetSurveyListNestedResponseDto {
  @ApiProperty({ description: '설문 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '설문 제목', example: '고객 만족도 조사' })
  title: string = '고객 만족도 조사';

  @ApiProperty({ description: '설문 설명', example: '고객 만족도 조사 설명' })
  description: string | null = null;

  @ApiProperty({ description: '설문 고유 키', example: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' })
  hashedUniqueKey: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  @ApiProperty({ description: '설문 카테고리', type: () => GetCategoryNestedResponseDto })
  category: GetCategoryNestedResponseDto = new GetCategoryNestedResponseDto();

  @ApiProperty({ description: '설문 공개 여부', example: true })
  isPublic: boolean = true;

  @ApiProperty({ enum: SurveyStatus, description: '설문 상태', example: SurveyStatus.Active })
  status: SurveyStatus = SurveyStatus.Active;

  @ApiProperty({ description: '설문 조회 수', example: 10 })
  viewCount: number = 10;

  @ApiProperty({ description: '설문 예상 소요 시간', example: 10 })
  estimatedTime: number = 10;

  @ApiProperty({ description: '설문 질문 수', example: 10 })
  questionAmount: number = 10;

  @ApiProperty({ description: '설문 응답자 수', example: 10 })
  responseAmount: number = 10;

  @ApiProperty({ description: '설문 생성일시', example: '2024-01-15T09:00:00.000Z' })
  createdAt: Date = new Date('2024-01-15T09:00:00.000Z');

  @ApiProperty({ description: '설문 수정일시', example: '2024-01-15T09:00:00.000Z' })
  updatedAt: Date = new Date('2024-01-15T09:00:00.000Z');
}
