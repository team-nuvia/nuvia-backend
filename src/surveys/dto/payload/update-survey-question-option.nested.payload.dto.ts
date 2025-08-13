import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateSurveyQuestionOptionPayloadNestedDto } from './create-survey-question-option.payload.nested.dto';

export class UpdateSurveyQuestionOptionNestedDto extends CreateSurveyQuestionOptionPayloadNestedDto {
  @ApiProperty({
    description: '질문 옵션 ID',
    example: 1,
  })
  @IsNullable()
  @IsNumber()
  id!: number | null;
}
