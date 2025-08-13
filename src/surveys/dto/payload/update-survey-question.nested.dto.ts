import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateSurveyQuestionOptionNestedDto } from './update-survey-question-option.nested.payload.dto';

export class UpdateSurveyQuestionNestedDto {
  @ApiProperty({
    description: '질문 PK',
    example: 1,
  })
  @IsNullable()
  @IsNumber()
  id!: number | null;

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
    description: '필수 여부',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isRequired!: boolean;

  @ApiProperty({
    description: '질문 순서',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  sequence!: number;

  @ApiProperty({
    description: '질문 옵션 데이터',
    type: () => UpdateSurveyQuestionOptionNestedDto,
    isArray: true,
  })
  @IsOptional({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @Type(() => UpdateSurveyQuestionOptionNestedDto)
  questionOptions!: UpdateSurveyQuestionOptionNestedDto[];
}
