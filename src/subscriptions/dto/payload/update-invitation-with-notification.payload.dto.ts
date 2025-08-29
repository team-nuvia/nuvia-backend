import { ApiProperty } from '@nestjs/swagger';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { IsEnum, IsNumber } from 'class-validator';

export class UpdateInvitationWithNotificationPayloadDto {
  @ApiProperty({ description: '알림 ID' })
  @IsNumber()
  notificationId!: number;

  @ApiProperty({ description: '초대 승락 여부', enum: OrganizationRoleStatusType })
  @IsEnum([OrganizationRoleStatusType.Joined, OrganizationRoleStatusType.Rejected])
  status!: OrganizationRoleStatusType;
}
