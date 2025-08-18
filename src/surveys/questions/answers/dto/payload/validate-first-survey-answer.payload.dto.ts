import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ValidateFirstSurveyAnswerPayloadDto {
  @ApiProperty({
    description: '설문 ID',
    example: 1,
  })
  @IsNumber()
  surveyId!: number;
}