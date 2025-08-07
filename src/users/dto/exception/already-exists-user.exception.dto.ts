import { ConflictException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class AlreadyExistsUserExceptionDto extends ConflictException {
  @ApiProperty({
    example: ErrorMessage.ALREADY_EXISTS_USER,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ALREADY_EXISTS_USER, reason });
  }
}
