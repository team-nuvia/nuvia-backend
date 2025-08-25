import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleReadNotificationPayloadDto {
  @ApiProperty({ description: '읽음 상태', example: true })
  @IsBoolean()
  isRead!: boolean;
}
