import { ErrorKey, ErrorMessage, UnauthorizedException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ExpiredTokenExceptionDto extends UnauthorizedException {
  @ApiProperty({
    example: ErrorMessage.EXPIRED_TOKEN,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.EXPIRED_TOKEN, reason });
  }
}
