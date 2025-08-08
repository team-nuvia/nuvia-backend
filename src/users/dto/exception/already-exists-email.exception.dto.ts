import { ConflictException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class AlreadyExistsEmailExceptionDto extends ConflictException {
  @ApiProperty({
    example: ErrorMessage.ALREADY_EXISTS_EMAIL,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ALREADY_EXISTS_EMAIL, reason });
  }
}
