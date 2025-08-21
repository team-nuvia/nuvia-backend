import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';
import { IsEnum } from 'class-validator';

export class UpdateSurveyStatusPayloadDto {
  @ApiProperty({
    enum: SurveyStatus,
    description: '설문 상태',
    example: SurveyStatus.Active,
  })
  @IsEnum(SurveyStatus)
  status!: SurveyStatus;
}
