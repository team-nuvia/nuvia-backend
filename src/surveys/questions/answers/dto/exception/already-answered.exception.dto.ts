import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class AlreadyAnsweredExceptionDto extends BadRequestException {
  @ApiProperty({
    example: ErrorMessage.ALREADY_ANSWERED,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ALREADY_ANSWERED, reason });
  }
}
