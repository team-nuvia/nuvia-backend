import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class FailEncodeTokenExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '토큰 암호화에 실패했습니다.',
    example: ErrorMessage.FAIL_ENCODE_TOKEN,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.FAIL_ENCODE_TOKEN, reason });
  }
}
