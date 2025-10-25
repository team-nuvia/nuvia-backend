import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class CannotSetDefaultRoleAsOwnerExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '에러 메시지',
    example: ErrorMessage.CANNOT_SET_DEFAULT_ROLE_AS_OWNER,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.CANNOT_SET_DEFAULT_ROLE_AS_OWNER, reason });
  }
}
