import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';

export class GetUserMeOrganizationNestedResponseDto {
  @ApiProperty({ description: '구독 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '조직 ID', example: 1 })
  organizationId: number = 1;

  @ApiProperty({ description: '조직 이름', example: '조직명' })
  name: string = '조직명';

  @ApiPropertyNullable({ description: '조직 설명', example: '조직 설명' })
  description: string | null = '조직 설명';

  @ApiProperty({ enum: SubscriptionTargetType, description: '구독 대상 타입', example: SubscriptionTargetType.Individual })
  target: SubscriptionTargetType = SubscriptionTargetType.Individual;

  @ApiProperty({ enum: SubscriptionStatusType, description: '구독 상태', example: SubscriptionStatusType.Active })
  status: SubscriptionStatusType = SubscriptionStatusType.Active;

  @ApiProperty({ description: '생성일', example: new Date() })
  createdAt: Date = new Date();

  @ApiProperty({ description: '수정일', example: new Date() })
  updatedAt: Date = new Date();
}
