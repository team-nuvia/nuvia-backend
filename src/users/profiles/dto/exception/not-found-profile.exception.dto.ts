import { ErrorKey, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundProfileExceptionDto extends NotFoundException {
  @ApiProperty({
    name: 'message',
    example: '프로필을 찾지 못했습니다.',
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_PROFILE, reason });
  }
}
