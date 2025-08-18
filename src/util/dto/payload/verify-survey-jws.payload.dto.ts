import { ApiProperty } from '@nestjs/swagger';

export class VerifySurveyJWSPayloadDto {
  @ApiProperty({ description: '답변 ID', example: 1 })
  answerId!: number;

  @ApiProperty({ description: '설문 ID', example: 1 })
  surveyId!: number;
}
