import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDetailQuestionAnswerFileNestedResponseDto {
  @ApiProperty({ description: '참조 버퍼 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '참조 버퍼 원본 이름', example: '참조 버퍼 원본 이름' })
  originalname: string = '참조 버퍼 원본 이름';

  @ApiProperty({ description: '참조 버퍼 파일 이름', example: '참조 버퍼 파일 이름' })
  filename: string = '참조 버퍼 파일 이름';

  @ApiProperty({ description: '참조 버퍼 파일 타입', example: '참조 버퍼 파일 타입' })
  mimetype: string = '참조 버퍼 파일 타입';

  @ApiProperty({ description: '참조 버퍼 파일 사이즈', example: 1 })
  size: number = 1;

  @ApiProperty({ description: '참조 버퍼 파일 바이트', example: Buffer.from('1234567890') })
  buffer: Buffer = Buffer.from('1234567890');

  @ApiProperty({ description: '참조 버퍼 생성 일시', example: new Date() })
  createdAt: Date = new Date();
}

export class AnswerDetailQuestionAnswerNestedResponseDto {
  @ApiProperty({ description: '질문 답변 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '질문 ID', example: 1 })
  questionId: number = 1;

  @ApiProperty({ description: '질문 옵션 ID', example: 1 })
  questionOptionId: number | null = null;

  @ApiPropertyNullable({ description: '답변 값', example: '옵션 1' })
  value: string | Buffer | null = null;

  @ApiProperty({ description: '참조 버퍼', example: new AnswerDetailQuestionAnswerFileNestedResponseDto() })
  referenceBuffer: AnswerDetailQuestionAnswerFileNestedResponseDto | null = null;
}
