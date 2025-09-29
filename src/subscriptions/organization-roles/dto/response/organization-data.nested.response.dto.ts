import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole } from '@share/enums/user-role';
import { IOrganization } from '@share/interface/iorganization';
import { OrganizationDataPermissionNestedResponseDto } from './organization-data-permission.nested.response.dto';
import { OrganizationDataPlanNestedResponseDto } from './organization-data-plan.nested.response.dto';

export class OrganizationDataNestedResponseDto implements IOrganization {
  @ApiProperty({
    description: '조직 ID',
    example: 1,
  })
  id: number = 1;

  @ApiProperty({
    description: '조직 ID',
    example: 1,
  })
  organizationId: number = 1;

  @ApiProperty({
    description: '조직 이름',
    example: '예시 조직 이름',
  })
  name: string = '예시 조직 이름';

  @ApiPropertyNullable({
    description: '조직 설명',
    example: '예시 설명',
  })
  description: string | null = '예시 설명';

  @ApiProperty({
    description: '역할',
    enum: UserRole,
    example: UserRole.Owner,
  })
  role: UserRole = UserRole.Owner;

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
    description: '생성일',
    example: new Date(),
  })
  createdAt: Date = new Date();

  @ApiProperty({
    description: '수정일',
    example: new Date(),
  })
  updatedAt: Date = new Date();

  @ApiProperty({
    description: '플랜',
    type: () => OrganizationDataPlanNestedResponseDto,
    example: new OrganizationDataPlanNestedResponseDto(),
  })
  plan: OrganizationDataPlanNestedResponseDto = new OrganizationDataPlanNestedResponseDto();

  @ApiProperty({
    description: '권한',
    type: () => OrganizationDataPermissionNestedResponseDto,
    example: new OrganizationDataPermissionNestedResponseDto(),
  })
  permission: OrganizationDataPermissionNestedResponseDto = new OrganizationDataPermissionNestedResponseDto();
}
