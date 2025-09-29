import { ApiProperty } from '@nestjs/swagger';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { UserRole } from '@share/enums/user-role';

export class TableOrganizationRoleNestedResponseDto {
  @ApiProperty({ description: '역할 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '사용자 이름', example: '김철수' })
  name: string = '김철수';

  @ApiProperty({ description: '사용자 이메일', example: 'kim@example.com' })
  email: string = 'kim@example.com';

  @ApiProperty({ description: '역할', enum: UserRole, example: UserRole.Admin })
  role: UserRole = UserRole.Admin;

  @ApiProperty({ description: '상태', enum: OrganizationRoleStatusType, example: OrganizationRoleStatusType.Joined })
  status: OrganizationRoleStatusType = OrganizationRoleStatusType.Joined;

  @ApiProperty({ description: '생성일', example: '2024-01-15' })
  createdAt: Date = new Date();
}
