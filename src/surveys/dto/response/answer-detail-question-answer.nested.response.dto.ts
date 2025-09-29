import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDetailQuestionAnswerNestedResponseDto {
  @ApiProperty({ description: '질문 ID', example: 1 })
  questionId: number = 1;

  @ApiProperty({ description: '질문 옵션 ID', example: 1 })
  questionOptionId: number | null = null;

  @ApiPropertyNullable({ description: '답변 값', example: '옵션 1' })
  value: string | null = null;
}
