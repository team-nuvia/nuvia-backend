import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';

export class GetUserMeOrganizationNestedResponseDto {
  @ApiProperty({ example: 1, description: '조직 ID' })
  id: number = 1;

  @ApiProperty({ example: 1, description: '조직 ID' })
  organizationId: number = 1;

  @ApiProperty({ example: '조직명', description: '조직 이름' })
  name: string = '조직명';

  @ApiProperty({ example: '조직 설명', description: '조직 설명', nullable: true })
  description: string | null = '조직 설명';

  @ApiProperty({ enum: SubscriptionTargetType, description: '구독 대상 타입' })
  target: SubscriptionTargetType = SubscriptionTargetType.Individual;

  @ApiProperty({ enum: SubscriptionStatusType, description: '구독 상태' })
  status: SubscriptionStatusType = SubscriptionStatusType.Active;

  @ApiProperty({ example: new Date(), description: '생성일' })
  createdAt: Date = new Date();

  @ApiProperty({ example: new Date(), description: '수정일' })
  updatedAt: Date = new Date();
}
