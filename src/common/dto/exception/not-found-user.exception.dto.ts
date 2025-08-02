import { ApiProperty } from '@nestjs/swagger';
import { ErrorKey, ErrorMessage, NotFoundException } from '../response';

export class NotFoundUserExceptionDto extends NotFoundException {
  @ApiProperty({
    example: ErrorMessage.NOT_FOUND_USER,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_USER, reason });
  }
}
