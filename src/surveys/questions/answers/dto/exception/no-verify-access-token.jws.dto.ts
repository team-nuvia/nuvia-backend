import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NoVerifyAccessTokenExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '오류 메시지',
    example: ErrorMessage.NO_VERIFY_ACCESS_TOKEN,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NO_VERIFY_ACCESS_TOKEN, reason });
  }
}
