import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSurveyQuestionOptionPayloadNestedDto {
  @ApiProperty({
    description: '질문 옵션 제목',
    example: '질문 옵션 제목',
  })
  @IsNotEmpty()
  @IsString()
  label!: string;

  @ApiPropertyNullable({
    description: '질문 옵션 설명',
    example: '질문 옵션 설명',
    required: false,
  })
  @IsNullable()
  @IsString()
  @IsOptional()
  description!: string | null;

  @ApiProperty({
    description: '질문 옵션 순서',
    example: 1,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  sequence!: number;
}
