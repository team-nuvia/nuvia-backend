import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSurveyQuestionOptionPayloadNestedDto {
  @ApiProperty({
    description: '질문 옵션 제목',
    example: '질문 옵션 제목',
  })
  @IsNotEmpty()
  @IsString()
  label!: string;

  @ApiProperty({
    description: '질문 옵션 설명',
    example: '질문 옵션 설명',
  })
  @IsNullable()
  @IsString()
  description!: string | null;

  @ApiProperty({
    description: '질문 옵션 순서',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  sequence!: number;
}
