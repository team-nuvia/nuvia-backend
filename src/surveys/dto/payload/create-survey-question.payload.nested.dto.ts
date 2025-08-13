import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CreateSurveyQuestionOptionPayloadNestedDto } from './create-survey-question-option.payload.nested.dto';

export class CreateSurveyQuestionPayloadNestedDto {
  @ApiProperty({
    description: '질문 제목',
    example: '질문 제목',
  })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({
    description: '질문 설명',
    example: '질문 설명',
  })
  @IsNullable()
  @IsString()
  description!: string | null;

  @ApiProperty({
    description: '질문 필수 여부',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isRequired!: boolean;

  @ApiProperty({
    enum: QuestionType,
    description: '질문 유형',
    example: '질문 유형',
  })
  @IsNotEmpty()
  @IsString()
  questionType!: QuestionType;

  @ApiProperty({
    enum: DataType,
    description: '질문 답변 유형',
    example: '질문 답변 유형',
  })
  @IsNotEmpty()
  @IsString()
  dataType!: DataType;

  @ApiProperty({
    description: '질문 옵션 목록',
    example: [],
  })
  @ArrayMinSize(0)
  @IsArray()
  options!: CreateSurveyQuestionOptionPayloadNestedDto[];
}
