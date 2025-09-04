import { MetadataCommonInterface } from '@common/interface/metadata-common.interface';
import { ApiProperty } from '@nestjs/swagger';

export class MetadataSurveyListNestedResponseDto extends MetadataCommonInterface {
  @ApiProperty({ description: '활성 설문 수', example: 5 })
  activeSurveyCount: number = 5;

  @ApiProperty({ description: '총 조회 수', example: 25 })
  totalViewCount: number = 25;
}
