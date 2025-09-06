import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException, ErrorKey, ErrorMessage } from '../response';

export class InvalidInputValueExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '에러 메시지',
    example: ErrorMessage.INVALID_INPUT_VALUE,
  })
  declare message: string;

  constructor(reason: string | null = null) {
    super({ code: ErrorKey.INVALID_INPUT_VALUE, reason });
  }
}
