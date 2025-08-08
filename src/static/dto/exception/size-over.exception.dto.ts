import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class SizeOverExceptionDto extends BadRequestException {
  @ApiProperty({
    example: ErrorMessage.SIZE_OVER,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.SIZE_OVER, reason });
  }
}
