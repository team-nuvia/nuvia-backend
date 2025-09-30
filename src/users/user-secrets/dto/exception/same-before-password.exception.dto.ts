import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class SameBeforePasswordExceptionDto extends BadRequestException {
  @ApiProperty({
    example: ErrorMessage.SAME_BEFORE_PASSWORD,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.SAME_BEFORE_PASSWORD, reason });
  }
}
