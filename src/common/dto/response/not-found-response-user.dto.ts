import { ApiProperty } from '@nestjs/swagger';
import { ErrorKey, ErrorMessage } from './error-code';
import { NotFoundException } from './exception.interface';

export class NotFoundResponseUserDto extends NotFoundException {
  @ApiProperty({
    description: ErrorMessage.NOT_FOUND_USER,
    type: String,
    example: ErrorMessage.NOT_FOUND_USER,
  })
  declare message: string;

  constructor(reason: string | null = null) {
    super(ErrorKey.NOT_FOUND_USER, reason);
  }
}
