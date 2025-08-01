import { ApiProperty } from '@nestjs/swagger';
import { ErrorKey, ErrorMessage } from '../response/error-code';
import { NotFoundException } from '../response/exception.interface';

export class NotFoundEmailException extends NotFoundException {
  @ApiProperty({
    description: ErrorMessage.NOT_FOUND_EMAIL,
    example: ErrorMessage.NOT_FOUND_EMAIL,
  })
  declare message: string;

  constructor(reason: string | null = null) {
    super({ code: ErrorKey.NOT_FOUND_EMAIL, reason });
  }
}
