import { ApiProperty } from '@nestjs/swagger';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSurveyQuestionNestedDto {
  @ApiProperty({
    description: '질문 PK',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id!: number;

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
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({
    description: '질문 유형',
    example: '질문 유형',
  })
  @IsNotEmpty()
  @IsString()
  questionType!: QuestionType;

  @ApiProperty({
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
}
