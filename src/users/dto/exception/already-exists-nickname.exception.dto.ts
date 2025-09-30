import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class AlreadyExistsNicknameExceptionDto extends BadRequestException {
  @ApiProperty({
    example: ErrorMessage.ALREADY_EXISTS_NICKNAME,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ALREADY_EXISTS_NICKNAME, reason });
  }
}
