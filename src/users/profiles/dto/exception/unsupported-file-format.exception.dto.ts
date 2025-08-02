import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class UnsupportedFileFormatExceptionDto extends BadRequestException {
  @ApiProperty({
    example: ErrorMessage.UNSUPPORTED_FILE_FORMAT,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.UNSUPPORTED_FILE_FORMAT, reason });
  }
}
