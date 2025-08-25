import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ExpiredInvitationTokenExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '초대 토큰 만료',
    example: ErrorMessage.EXPIRED_INVITATION_TOKEN,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.EXPIRED_INVITATION_TOKEN, reason });
  }
}
