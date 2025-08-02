import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NoExistsUploadFileExceptionDto extends BadRequestException {
  @ApiProperty({
    description: ErrorMessage.NO_EXISTS_UPLOAD_FILE,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NO_EXISTS_UPLOAD_FILE, reason });
  }
}
