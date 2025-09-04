import { ApiProperty } from '@nestjs/swagger';

export class MetadataCommonInterface {
  @ApiProperty({ description: '총 설문 수', example: 5 })
  totalSurveyCount: number = 5;

  @ApiProperty({ description: '총 응답자 수', example: 25 })
  totalRespondentCount: number = 25;
}
