import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSurveyQuestionOptionPayloadNestedDto {
  @ApiProperty({
    description: '질문 옵션 제목',
    example: '질문 옵션 제목',
  })
  @IsNotEmpty()
  @IsString()
  label!: string;
}
