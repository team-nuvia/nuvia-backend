import { ApiProperty } from '@nestjs/swagger';
import { AnswerStatus } from '@share/enums/answer-status';
import { AnswerDetailQuestionAnswerNestedResponseDto } from './answer-detail-question-answer.nested.response.dto';

export class SurveyDetailAnswerDetailNestedResponseDto {
  @ApiProperty({ description: '응답 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ enum: AnswerStatus, description: '응답 상태', example: AnswerStatus.Completed })
  status: AnswerStatus = AnswerStatus.Completed;

  @ApiProperty({ description: '응답 해시', example: '1234567890' })
  submissionHash: string = '1234567890';

  @ApiProperty({ description: '만료일시', example: new Date() })
  expiredAt: Date = new Date();

  @ApiProperty({
    description: '질문 답변',
    type: () => AnswerDetailQuestionAnswerNestedResponseDto,
    isArray: true,
    example: [new AnswerDetailQuestionAnswerNestedResponseDto()],
  })
  questionAnswers: AnswerDetailQuestionAnswerNestedResponseDto[] = [];
}
