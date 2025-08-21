import { ErrorKey, ErrorMessage, ForbiddenException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotAllowedInviteExceptionDto extends ForbiddenException {
  @ApiProperty({ description: '초대 권한 없음', example: ErrorMessage.NOT_ALLOWED_INVITE })
  declare message: string;

  constructor(reason: string | null = null) {
    super({ code: ErrorKey.NOT_ALLOWED_INVITE, reason });
  }
}
