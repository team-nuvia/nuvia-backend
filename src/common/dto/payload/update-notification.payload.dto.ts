import { ApiProperty } from '@nestjs/swagger';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { IsEnum } from 'class-validator';

export class UpdateOrganizationRoleStatusPayloadDto {
  @ApiProperty({ description: '상태', example: OrganizationRoleStatusType.Invited })
  @IsEnum([OrganizationRoleStatusType.Joined, OrganizationRoleStatusType.Rejected])
  status!: OrganizationRoleStatusType;
}
