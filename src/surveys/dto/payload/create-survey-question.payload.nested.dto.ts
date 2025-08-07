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
  @IsString()
  description!: string;

  @ApiProperty({
    description: '질문 필수 여부',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isRequired!: boolean;

  @ApiProperty({
    description: '질문 유형',
    example: '질문 유형',
  })
  @IsNotEmpty()
  @IsString()
  questionType!: QuestionType;

  @ApiProperty({
    description: '질문 옵션 유형',
    example: '질문 옵션 유형',
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
