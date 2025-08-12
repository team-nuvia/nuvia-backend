import { ErrorKey, ErrorMessage, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundUserAccessExceptionDto extends NotFoundException {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.NOT_FOUND_USER_ACCESS,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_USER_ACCESS, reason });
  }
}
