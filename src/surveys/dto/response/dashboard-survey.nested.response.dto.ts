import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';
import { GetCategoryNestedResponseDto } from './get-category.nested.response.dto';

export class DashboardSurveyNestedResponseDto {
  @ApiProperty({
    description: '설문조사 ID',
    example: 1,
  })
  id: number = 1;

  @ApiProperty({ description: '설문 카테고리', type: () => GetCategoryNestedResponseDto })
  category: GetCategoryNestedResponseDto = new GetCategoryNestedResponseDto();

  @ApiProperty({
    description: '설문조사 제목',
    example: '고객 만족도 조사',
  })
  title: string = '고객 만족도 조사';

  @ApiProperty({
    description: '설문조사 설명',
    example: '고객 서비스 개선을 위한 만족도 조사입니다.',
    nullable: true,
  })
  description: string | null = null;

  @ApiProperty({
    description: '공개 여부',
    example: true,
  })
  isPublic: boolean = true;

  @ApiProperty({
    description: '설문조사 상태',
    enum: SurveyStatus,
    example: SurveyStatus.Active,
  })
  status: SurveyStatus = SurveyStatus.Active;

  @ApiProperty({
    description: '질문 개수',
    example: 10,
  })
  questionCount: number = 10;

  @ApiProperty({
    description: '응답자 수',
    example: 150,
  })
  respondentCount: number = 150;

  @ApiProperty({
    description: '만료일',
    example: '2024-12-31T23:59:59.000Z',
    nullable: true,
  })
  expiresAt: Date | null = null;

  @ApiProperty({
    description: '생성일',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date = new Date('2024-01-01T00:00:00.000Z');

  @ApiProperty({
    description: '수정일',
    example: '2024-01-15T12:30:00.000Z',
  })
  updatedAt: Date = new Date('2024-01-15T12:30:00.000Z');
}
