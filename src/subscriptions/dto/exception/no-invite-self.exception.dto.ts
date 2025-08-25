import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NoInviteSelfExceptionDto extends BadRequestException {
  @ApiProperty({ description: '메시지', example: ErrorMessage.NO_INVITE_SELF })
  declare message: string;

  constructor(reason: string | null = null) {
    super({ code: ErrorKey.NO_INVITE_SELF, reason });
  }
}
