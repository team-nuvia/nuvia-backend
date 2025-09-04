import { MetadataCommonInterface } from '@common/interface/metadata-common.interface';
import { ApiProperty } from '@nestjs/swagger';
import { PlanNameType } from '@share/enums/plan-name-type.enum';

export class PlanUsageNestedResponseDto {
  @ApiProperty({ description: '플랜 타입', enum: PlanNameType, example: PlanNameType.Free })
  plan: PlanNameType = PlanNameType.Free;

  @ApiProperty({ description: '월간 사용량', example: 3 })
  usage: number = 3;

  @ApiProperty({ description: '월간 제한량', example: 10 })
  limit: number = 10;
}

export class MetadataDashboardSurveyNestedResponseDto extends MetadataCommonInterface {
  @ApiProperty({ description: '총 완료 응답자 수', example: 10 })
  totalCompletedRespondentCount: number = 10;

  @ApiProperty({ description: '플랜 사용량', type: () => PlanUsageNestedResponseDto, example: new PlanUsageNestedResponseDto() })
  planUsage: PlanUsageNestedResponseDto = new PlanUsageNestedResponseDto();
}
