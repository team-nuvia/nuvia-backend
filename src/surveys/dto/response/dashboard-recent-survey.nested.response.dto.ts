import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';
import { GetCategoryNestedResponseDto } from './get-category.nested.response.dto';

export class DashboardRecentSurveyNestedResponseDto {
  @ApiProperty({ description: '설문 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '설문 카테고리', type: () => GetCategoryNestedResponseDto })
  category: GetCategoryNestedResponseDto = new GetCategoryNestedResponseDto();

  @ApiProperty({ description: '설문 유니크 키', example: '1234567890' })
  hashedUniqueKey: string = '1234567890';

  @ApiProperty({ description: '설문 제목', example: '고객 만족도 조사' })
  title: string = '고객 만족도 조사';

  @ApiProperty({ description: '설문 설명', nullable: true, example: '서비스 개선을 위한 고객 만족도 조사입니다.' })
  description: string | null = null;

  @ApiProperty({ enum: SurveyStatus, description: '설문 상태', example: SurveyStatus.Active })
  status: SurveyStatus = SurveyStatus.Active;

  @ApiProperty({ description: '응답자 수', example: 10 })
  responses: number = 10;

  @ApiProperty({ description: '만료일시', example: null, nullable: true })
  expiresAt: Date | null = null;

  @ApiProperty({ description: '생성일시', example: new Date() })
  createdAt: Date = new Date();

  @ApiProperty({ description: '수정일시', example: new Date() })
  updatedAt: Date = new Date();
}
