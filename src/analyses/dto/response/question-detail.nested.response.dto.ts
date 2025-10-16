import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';

export class BucketNestedResponseDto {
  @ApiProperty({ description: '값', example: '검색엔진' })
  value: string = '검색엔진';

  @ApiProperty({ description: '개수', example: 420 })
  count: number = 420;
}

export class SampleNestedResponseDto {
  @ApiProperty({ description: '샘플 내용', example: '다크모드 대비가 약해요' })
  snippet: string = '다크모드 대비가 약해요';

  @ApiProperty({ description: '샘플 개수', example: 12 })
  count: number = 12;
}

export class BinNestedResponseDto {
  @ApiProperty({ description: '범위 시작', example: '00:00' })
  x0: string = '00:00';

  @ApiProperty({ description: '범위 종료', example: '01:00' })
  x1: string = '01:00';

  @ApiProperty({ description: '범위 개수', example: 10 })
  count: number = 10;
}

export class DistributionNestedResponseDto {
  @ApiProperty({
    description: '분포 유형',
    enum: [...Object.values(QuestionType), ...Object.values(DataType).filter((value) => value !== DataType.Text)] as const,
    example: QuestionType.SingleChoice,
  })
  type: QuestionType | DataType = QuestionType.SingleChoice;

  @ApiProperty({
    description: '분포 버킷',
    type: () => BucketNestedResponseDto,
    isArray: true,
    example: [new BucketNestedResponseDto()],
  })
  buckets: BucketNestedResponseDto[] | null = [new BucketNestedResponseDto()];

  @ApiPropertyNullable({ description: '샘플', type: () => SampleNestedResponseDto, isArray: true, example: [new SampleNestedResponseDto()] })
  samples: SampleNestedResponseDto[] | null = [new SampleNestedResponseDto()];

  @ApiPropertyNullable({
    description: '분포 범위',
    type: () => BinNestedResponseDto,
    isArray: true,
    example: [new BinNestedResponseDto()],
  })
  bins: BinNestedResponseDto[] | null = [new BinNestedResponseDto()];
}

export class QuestionDetailNestedResponseDto {
  @ApiProperty({ description: '질문 ID', example: 1 })
  questionId: number = 0;

  @ApiProperty({ description: '질문 제목', example: '우리 서비스를 어떻게 알게 되셨나요?' })
  questionTitle: string = '우리 서비스를 어떻게 알게 되셨나요?';

  @ApiProperty({ description: '질문 유형', example: QuestionType.SingleChoice })
  questionType: QuestionType = QuestionType.SingleChoice;

  @ApiProperty({ description: '총 응답 수', example: 1180 })
  totalAnswers: number = 1180;

  @ApiPropertyNullable({ description: '비고', example: '비고' })
  note: string | null = '비고';

  @ApiPropertyNullable({
    description: '분포',
    type: () => DistributionNestedResponseDto,
    example: new DistributionNestedResponseDto(),
  })
  distribution: DistributionNestedResponseDto | null = new DistributionNestedResponseDto();
}
