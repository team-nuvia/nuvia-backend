import { ErrorKey, ErrorMessage, ForbiddenException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NoMatchOrganizationExceptionDto extends ForbiddenException {
  @ApiProperty({
    description: '에러 메시지',
    example: ErrorMessage.NO_MATCH_ORGANIZATION,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NO_MATCH_ORGANIZATION, reason });
  }
}
