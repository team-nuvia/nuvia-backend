import { ErrorKey, ErrorMessage, ForbiddenException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotEnoughPermissionExceptionDto extends ForbiddenException {
  @ApiProperty({
    description: '에러 메시지',
    example: ErrorMessage.NOT_ENOUGH_PERMISSION,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_ENOUGH_PERMISSION, reason });
  }
}
