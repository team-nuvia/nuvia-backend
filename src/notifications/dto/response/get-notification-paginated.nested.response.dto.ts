import { PaginatedResponseDto } from '@common/interface/paginated.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationNestedResponseDto } from './notification.nested.response.dto';

export class GetNotificationPaginatedNestedResponseDto implements PaginatedResponseDto<NotificationNestedResponseDto> {
  @ApiProperty({ description: '페이지', example: 1 })
  page: number = 1;

  @ApiProperty({ description: '페이지 크기', example: 10 })
  limit: number = 10;

  @ApiProperty({ description: '총 알림 개수', example: 100 })
  total: number = 100;

  @ApiProperty({
    description: '알림 목록',
    type: () => NotificationNestedResponseDto,
    isArray: true,
    example: [new NotificationNestedResponseDto()],
  })
  data: NotificationNestedResponseDto[] = [new NotificationNestedResponseDto()];
}
