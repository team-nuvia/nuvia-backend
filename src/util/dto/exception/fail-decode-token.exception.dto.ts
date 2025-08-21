import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class FailDecodeTokenExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '잘못된 토큰입니다.',
    example: ErrorMessage.FAIL_DECODE_TOKEN,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.FAIL_DECODE_TOKEN, reason });
  }
}
