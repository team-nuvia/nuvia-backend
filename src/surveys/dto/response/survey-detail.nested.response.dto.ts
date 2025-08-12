import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';
import { QuestionDetailNestedResponseDto } from './question-detail.nested.response.dto';

export class SurveyDetailNestedResponseDto {
  @ApiProperty({ description: '설문조사 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '설문조사 제목', example: '고객 만족도 조사' })
  title: string = '고객 만족도 조사';

  @ApiProperty({ description: '설문조사 설명', example: '우리 서비스에 대한 만족도를 조사합니다.', required: false })
  description: string | null = null;

  @ApiProperty({
    description: '작성자 정보',
    example: { id: 1, name: '홍길동', profileImage: 'https://example.com/profile.jpg' },
    required: false,
  })
  author: {
    id: number;
    name: string;
    profileImage: string | null;
  } | null = null;

  @ApiProperty({ description: '예상 소요 시간(분)', example: 10 })
  estimatedTime: number = 10;

  @ApiProperty({ description: '총 응답 수', example: 150 })
  totalResponses: number = 150;

  @ApiProperty({ description: '질문 목록', type: () => QuestionDetailNestedResponseDto, isArray: true })
  questions: QuestionDetailNestedResponseDto[] = [];

  @ApiProperty({ description: '공개 여부', example: true })
  isPublic: boolean = true;

  @ApiProperty({ enum: SurveyStatus, description: '설문조사 상태', example: SurveyStatus.Active })
  status: SurveyStatus = SurveyStatus.Active;

  @ApiProperty({ description: '질문 개수', example: 5 })
  questionCount: number = 5;

  @ApiProperty({ description: '응답자 수', example: 150 })
  respondentCount: number = 150;

  @ApiProperty({ description: '소유자 여부', example: true })
  isOwner: boolean = true;

  @ApiProperty({ description: '만료일시', example: '2024-12-31T23:59:59.000Z', required: false })
  expiresAt: Date | null = null;

  @ApiProperty({ description: '생성일시', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date = new Date('2024-01-01T00:00:00.000Z');

  @ApiProperty({ description: '수정일시', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date = new Date('2024-01-01T00:00:00.000Z');
}
