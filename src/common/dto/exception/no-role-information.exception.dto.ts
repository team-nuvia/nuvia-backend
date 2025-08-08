import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NoRoleInformationExceptionDto extends BadRequestException {
  @ApiProperty({
    example: ErrorMessage.NO_ROLE_INFORMATION,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NO_ROLE_INFORMATION, reason });
  }
}
