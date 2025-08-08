import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NoMatchUserInformationExceptionDto extends BadRequestException {
  @ApiProperty({
    example: ErrorMessage.NO_MATCH_USER_INFORMATION,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NO_MATCH_USER_INFORMATION, reason });
  }
}
