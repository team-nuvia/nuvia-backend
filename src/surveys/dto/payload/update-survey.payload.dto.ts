import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { UpdateSurveyFormDataNestedDto } from './update-survey-form-data.nested.dto';
import { UpdateSurveyQuestionNestedDto } from './update-survey-question.nested.dto';

export class UpdateSurveyPayloadDto {
  @ApiProperty({
    description: '설문 폼 데이터',
    type: () => UpdateSurveyFormDataNestedDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateSurveyFormDataNestedDto)
  surveyFormData!: UpdateSurveyFormDataNestedDto;

  @ApiProperty({
    description: '설문 질문 데이터',
    type: () => UpdateSurveyQuestionNestedDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSurveyQuestionNestedDto)
  surveyQuestionData!: UpdateSurveyQuestionNestedDto[];
}
