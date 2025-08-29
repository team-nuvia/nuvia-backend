import { ApiProperty } from '@nestjs/swagger';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';

export class TableOrganizationRoleNestedResponseDto {
  @ApiProperty({ description: '역할 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '사용자 이름', example: '김철수' })
  name: string = '김철수';

  @ApiProperty({ description: '사용자 이메일', example: 'kim@example.com' })
  email: string = 'kim@example.com';

  @ApiProperty({ description: '역할', example: 'admin' })
  role: string = 'admin';

  @ApiProperty({ description: '상태', example: OrganizationRoleStatusType.Joined })
  status: OrganizationRoleStatusType = OrganizationRoleStatusType.Joined;

  @ApiProperty({ description: '생성일', example: '2024-01-15' })
  createdAt: Date = new Date();
}
