import { ApiProperty } from '@nestjs/swagger';
import { ErrorKey, ErrorMessage } from '../response/error-code';
import { NotFoundException } from '../response/exception.interface';

export class NotFoundUserException extends NotFoundException {
  @ApiProperty({
    description: ErrorMessage.NOT_FOUND_USER,
    example: ErrorMessage.NOT_FOUND_USER,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_USER, reason });
  }
}
