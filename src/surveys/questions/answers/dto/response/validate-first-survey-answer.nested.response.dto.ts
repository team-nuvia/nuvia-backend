import { ApiProperty } from '@nestjs/swagger';

export class ValidateFirstSurveyAnswerNestedResponseDto {
  @ApiProperty({
    description: '첫 번째 질문 유효성 검사 여부',
    example: true,
  })
  isFirst!: boolean;

  @ApiProperty({
    description: '설문 응답 완료 여부',
    example: true,
  })
  isCompleted!: boolean;
}
