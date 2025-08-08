import { ErrorKey, ErrorMessage, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundProfileImageDto extends NotFoundException {
  @ApiProperty({
    example: ErrorMessage.NOT_FOUND_PROFILE_IMAGE,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_PROFILE_IMAGE, reason });
  }
}
