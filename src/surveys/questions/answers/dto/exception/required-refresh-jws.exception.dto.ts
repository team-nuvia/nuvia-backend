import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class RequiredRefreshJwsExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '인증 토큰 만료 이유',
    example: ErrorMessage.REQUIRED_REFRESH_JWS,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.REQUIRED_REFRESH_JWS, reason });
  }
}
