import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class AlreadyJoinedUserExceptionDto extends BadRequestException {
  @ApiProperty({
    example: ErrorMessage.ALREADY_JOINED_USER,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ALREADY_JOINED_USER, reason });
  }
}
