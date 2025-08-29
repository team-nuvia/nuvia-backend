import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NoSignedUserExceptionDto extends BadRequestException {
  @ApiProperty({ description: '메시지', example: ErrorMessage.NO_SIGN_USERS })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NO_SIGN_USERS, reason });
  }
}
