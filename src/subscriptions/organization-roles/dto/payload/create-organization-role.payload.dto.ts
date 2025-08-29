import { ApiProperty } from '@nestjs/swagger';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { UserRole } from '@share/enums/user-role';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateOrganizationRolePayloadDto {
  @ApiProperty({
    description: '역할',
    enum: UserRole,
    example: UserRole.Viewer,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;

  @ApiProperty({
    description: '상태',
    enum: OrganizationRoleStatusType,
    example: OrganizationRoleStatusType.Joined,
  })
  @IsEnum(OrganizationRoleStatusType)
  @IsNotEmpty()
  status!: OrganizationRoleStatusType;
}
