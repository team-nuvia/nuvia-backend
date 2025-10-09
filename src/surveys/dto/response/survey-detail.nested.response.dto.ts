import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { AuthorNestedResponseDto } from '@common/dto/response/author.nested.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';
import { GetCategoryNestedResponseDto } from './get-category.nested.response.dto';
import { QuestionDetailNestedResponseDto } from './question-detail.nested.response.dto';

export class SurveyDetailNestedResponseDto {
  @ApiProperty({ description: '설문조사 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '설문 유니크 키', example: '1234567890' })
  hashedUniqueKey: string = '1234567890';

  @ApiProperty({ description: '설문 조직 ID', example: 1 })
  subscriptionId: number = 1;

  @ApiProperty({ description: '설문 카테고리', type: () => GetCategoryNestedResponseDto })
  category: GetCategoryNestedResponseDto = new GetCategoryNestedResponseDto();

  @ApiProperty({ description: '조회 수', example: 100 })
  viewCount: number = 100;

  @ApiProperty({ description: '설문조사 제목', example: '고객 만족도 조사' })
  title: string = '고객 만족도 조사';

  @ApiPropertyNullable({ description: '설문조사 설명', example: '우리 서비스에 대한 만족도를 조사합니다.' })
  description: string | null = '우리 서비스에 대한 만족도를 조사합니다.';

  @ApiProperty({
    description: '작성자 정보',
    type: () => AuthorNestedResponseDto,
    example: new AuthorNestedResponseDto(),
  })
  author: AuthorNestedResponseDto | null = new AuthorNestedResponseDto();

  @ApiProperty({ description: '예상 소요 시간(분)', example: 10 })
  estimatedTime: number = 10;

  @ApiProperty({ description: '총 응답 수', example: 150 })
  totalResponses: number = 150;

  @ApiProperty({
    description: '질문 목록',
    type: () => QuestionDetailNestedResponseDto,
    isArray: true,
    example: [new QuestionDetailNestedResponseDto(), new QuestionDetailNestedResponseDto()],
  })
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

  @ApiPropertyNullable({ description: '만료일시', example: new Date() })
  expiresAt: Date | null = new Date();

  @ApiProperty({ description: '생성일시', example: new Date() })
  createdAt: Date = new Date();

  @ApiProperty({ description: '수정일시', example: new Date() })
  updatedAt: Date = new Date();
}
