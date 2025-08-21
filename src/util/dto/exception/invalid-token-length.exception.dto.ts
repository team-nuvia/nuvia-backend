import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class InvalidTokenLengthExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '토큰 길이가 비정상입니다.',
    example: ErrorMessage.INVALID_TOKEN_LENGTH,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.INVALID_TOKEN_LENGTH, reason });
  }
}
