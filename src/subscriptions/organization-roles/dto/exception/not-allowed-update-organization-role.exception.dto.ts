import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotAllowedUpdateOrganizationRoleExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '에러 메시지',
    example: ErrorMessage.NOT_ALLOWED_UPDATE_ORGANIZATION_ROLE,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_ALLOWED_UPDATE_ORGANIZATION_ROLE, reason });
  }
}
