import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ExceededTeamLimitExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.EXCEEDED_TEAM_LIMIT,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.EXCEEDED_TEAM_LIMIT, reason });
  }
}
