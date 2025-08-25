import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { GetNotificationPaginatedNestedResponseDto } from './get-notification-paginated.nested.response.dto';

export class GetNotificationResponseDto extends GetResponse<GetNotificationPaginatedNestedResponseDto> {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.SUCCESS_GET_NOTIFICATION,
  })
  message: string = ErrorMessage.SUCCESS_GET_NOTIFICATION;

  @ApiProperty({
    description: '알림 목록',
    type: () => GetNotificationPaginatedNestedResponseDto,
    isArray: true,
    example: [new GetNotificationPaginatedNestedResponseDto()],
  })
  declare payload: GetNotificationPaginatedNestedResponseDto;

  constructor(payload: GetNotificationPaginatedNestedResponseDto = new GetNotificationPaginatedNestedResponseDto()) {
    super(payload);
  }
}
