import { ForbiddenException } from '@common/dto/response';
import { ErrorKey, ErrorMessage } from '@common/dto/response/error-code';
import { ApiProperty } from '@nestjs/swagger';

export class ExceededTeamInviteLimitExceptionDto extends ForbiddenException {
  @ApiProperty({
    description: '초대 가능한 인원을 초과했습니다.',
    example: ErrorMessage.EXCEEDED_TEAM_INVITE_LIMIT,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.EXCEEDED_TEAM_INVITE_LIMIT, reason });
  }
}
