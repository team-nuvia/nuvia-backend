import { ApiProperty } from '@nestjs/swagger';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class QuestionOptionDetailNestedResponseDto {
  @ApiProperty({
    description: '옵션 PK',
    example: 1,
  })
  id: number = 1;

  @ApiProperty({
    description: '옵션 라벨',
    example: '옵션 라벨',
  })
  label: string = '옵션 라벨';
}

export class QuestionDetailNestedResponseDto {
  @ApiProperty({
    description: '질문 PK',
    example: 1,
  })
  id: number = 0;

  @ApiProperty({
    description: '질문 제목',
    example: '질문 제목',
  })
  title: string = '질문 제목';

  @ApiProperty({
    description: '질문 설명',
    example: '질문 설명',
  })
  description: string | null = null;

  @ApiProperty({
    description: '필수 여부',
    example: true,
  })
  isRequired: boolean = false;

  @ApiProperty({
    enum: QuestionType,
    description: '질문 유형',
    example: QuestionType.ShortText,
  })
  questionType: QuestionType = QuestionType.ShortText;

  @ApiProperty({
    enum: DataType,
    description: '질문 답변 유형',
    example: DataType.Text,
  })
  dataType: DataType = DataType.Text;

  @ApiProperty({
    description: '질문 순서',
    example: 1,
  })
  sequence: number = 1;

  @ApiProperty({
    description: '질문 옵션 목록',
    type: () => QuestionOptionDetailNestedResponseDto,
    isArray: true,
    example: new QuestionOptionDetailNestedResponseDto(),
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDetailNestedResponseDto)
  options: QuestionOptionDetailNestedResponseDto[] = [new QuestionOptionDetailNestedResponseDto()];
}
