import { ApiProperty } from '@nestjs/swagger';
import { ErrorKey, ErrorMessage, NotFoundException } from '../response';

export class NotFoundEmailExceptionDto extends NotFoundException {
  @ApiProperty({
    example: ErrorMessage.NOT_FOUND_EMAIL,
  })
  declare message: string;

  constructor(reason: string | null = null) {
    super({ code: ErrorKey.NOT_FOUND_EMAIL, reason });
  }
}
