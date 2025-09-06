import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ExceededRestoreLimitExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.EXCEEDED_RESTORE_LIMIT,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.EXCEEDED_RESTORE_LIMIT, reason });
  }
}