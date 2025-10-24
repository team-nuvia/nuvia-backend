import { ErrorKey, ErrorMessage, ForbiddenException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenAccessExceptionDto extends ForbiddenException {
  @ApiProperty({
    example: ErrorMessage.FORBIDDEN_ACCESS,
  })
  declare message: string;

  constructor(reason: string | null = null) {
    super({ code: ErrorKey.FORBIDDEN_ACCESS, reason });
  }
}
