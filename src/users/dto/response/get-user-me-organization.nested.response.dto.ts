import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';

export class GetUserMeOrganizationNestedResponseDto {
  @ApiProperty({ example: 1, description: '조직 ID' })
  id!: number;

  @ApiProperty({ example: '조직명', description: '조직 이름' })
  name!: string;

  @ApiProperty({ example: '조직 설명', description: '조직 설명', nullable: true })
  description!: string | null;

  @ApiProperty({ enum: SubscriptionTargetType, description: '구독 대상 타입' })
  target!: SubscriptionTargetType;

  @ApiProperty({ enum: SubscriptionStatusType, description: '구독 상태' })
  status!: SubscriptionStatusType;

  @ApiProperty({ example: new Date(), description: '생성일' })
  createdAt!: Date;

  @ApiProperty({ example: new Date(), description: '수정일' })
  updatedAt!: Date;
}
