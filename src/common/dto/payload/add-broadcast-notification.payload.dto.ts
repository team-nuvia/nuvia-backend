import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@share/enums/notification-type';

export class AddBroadcastNotificationPayloadDto {
  @ApiProperty({ description: '알림 발신자', example: 1 })
  fromId!: number;

  @ApiProperty({ description: '알림 수신 조직 ID', example: 1 })
  toSubscriptionId!: number;

  @ApiPropertyNullable({ description: '알림 타입', enum: NotificationType, example: NotificationType.Invitation })
  type!: NotificationType | null;

  @ApiPropertyNullable({ description: '참조 아이디', example: 1 })
  referenceId!: number | null;

  @ApiProperty({ description: '알림 제목', example: '알림 제목' })
  title!: string;

  @ApiPropertyNullable({ description: '알림 내용', example: '알림 내용' })
  content!: string | null;
}
