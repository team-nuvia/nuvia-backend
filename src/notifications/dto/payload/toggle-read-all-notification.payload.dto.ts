import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { ToggleReadNotificationPayloadDto } from './toggle-read-notification.payload.dto';

export class ToggleReadAllNotificationPayloadDto extends ToggleReadNotificationPayloadDto {
  @ApiProperty({ description: '알림 고유 번호 배열', example: [1, 2, 3] })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1, { message: '알림은 최소 1개 이상이어야 합니다.' })
  notificationIds!: number[];
}
