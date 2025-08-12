import { ErrorMessage, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundSubscriptionExceptionDto extends NotFoundException {
  @ApiProperty({ description: '에러 메시지', example: ErrorMessage.NOT_FOUND_SUBSCRIPTION })
  message: string = ErrorMessage.NOT_FOUND_SUBSCRIPTION;
}
