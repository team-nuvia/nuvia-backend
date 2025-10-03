import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateSurveyQuestionOptionPayloadNestedDto } from './create-survey-question-option.payload.nested.dto';

export class UpdateSurveyQuestionOptionNestedDto extends CreateSurveyQuestionOptionPayloadNestedDto {
  @ApiPropertyNullable({
    description: '질문 옵션 ID',
    example: 1,
    required: false,
  })
  @IsNullable()
  @IsNumber()
  @IsOptional()
  id!: number | null;
}
