import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationActionStatus } from '@share/enums/notification-action-status';
import { IsBoolean, IsEnum } from 'class-validator';

export class ToggleReadNotificationPayloadDto {
  @ApiProperty({ description: '읽음 상태', example: true })
  @IsBoolean()
  isRead!: boolean;

  @ApiPropertyNullable({ required: false, description: '액션 상태', example: NotificationActionStatus.Joined })
  @IsEnum(NotificationActionStatus)
  @IsNullable()
  actionStatus?: NotificationActionStatus | null;
}
