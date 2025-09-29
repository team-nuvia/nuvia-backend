import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { PlanNameType } from '@share/enums/plan-name-type.enum';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole } from '@share/enums/user-role';

export class CurrentOrganizationNestedResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number = 1;

  @ApiProperty({
    example: 1,
  })
  organizationId: number = 1;

  @ApiProperty({
    example: '예시 조직 이름',
  })
  name: string = '예시 조직 이름';

  @ApiPropertyNullable({
    example: '예시 설명',
  })
  description: string | null = '예시 설명';

  @ApiProperty({
    description: '타겟',
    enum: SubscriptionTargetType,
    example: SubscriptionTargetType.Individual,
  })
  target: SubscriptionTargetType = SubscriptionTargetType.Individual;

  @ApiProperty({
    description: '상태',
    enum: SubscriptionStatusType,
    example: SubscriptionStatusType.Active,
  })
  status: SubscriptionStatusType = SubscriptionStatusType.Active;

  @ApiProperty({
    description: '역할',
    enum: UserRole,
    example: UserRole.Owner,
  })
  role: UserRole = UserRole.Owner;

  @ApiProperty({
    description: '플랜',
    enum: PlanNameType,
    example: PlanNameType.Basic,
  })
  plan: PlanNameType = PlanNameType.Basic;

  @ApiProperty({
    description: '생성일',
    example: new Date(),
  })
  createdAt: Date = new Date();
}
