import { ErrorKey, ErrorMessage } from '@common/dto/response';
import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundOrganizationExceptionDto extends NotFoundException {
  @ApiProperty({
    example: ErrorMessage.NOT_FOUND_ORGANIZATION,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_ORGANIZATION, reason });
  }
}
