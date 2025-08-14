import { ErrorKey, ErrorMessage, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundOrganizationRoleExceptionDto extends NotFoundException {
  @ApiProperty({
    example: ErrorMessage.NOT_FOUND_ORGANIZATION_ROLE,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_ORGANIZATION_ROLE, reason });
  }
}
