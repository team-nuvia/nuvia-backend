import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole } from '@share/enums/user-role';
import { IOrganization } from '@share/interface/iorganization';
import { OrganizationDataPermissionNestedResponseDto } from './organization-data-permission.nested.response.dto';
import { OrganizationDataPlanNestedResponseDto } from './organization-data-plan.nested.response.dto';

export class OrganizationDataNestedResponseDto implements IOrganization {
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

  @ApiProperty({
    example: '예시 설명',
    nullable: true,
  })
  description: string | null = '예시 설명';

  @ApiProperty({
    enum: UserRole,
    example: UserRole.Owner,
  })
  role: UserRole = UserRole.Owner;

  @ApiProperty({
    enum: SubscriptionTargetType,
    example: SubscriptionTargetType.Individual,
  })
  target: SubscriptionTargetType = SubscriptionTargetType.Individual;

  @ApiProperty({
    enum: SubscriptionStatusType,
    example: SubscriptionStatusType.Active,
  })
  status: SubscriptionStatusType = SubscriptionStatusType.Active;

  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date = new Date();

  @ApiProperty({
    example: new Date(),
  })
  updatedAt: Date = new Date();

  @ApiProperty({
    type: () => OrganizationDataPlanNestedResponseDto,
    example: new OrganizationDataPlanNestedResponseDto(),
  })
  plan: OrganizationDataPlanNestedResponseDto = new OrganizationDataPlanNestedResponseDto();

  @ApiProperty({
    type: () => OrganizationDataPermissionNestedResponseDto,
    example: new OrganizationDataPermissionNestedResponseDto(),
  })
  permission: OrganizationDataPermissionNestedResponseDto = new OrganizationDataPermissionNestedResponseDto();
}
