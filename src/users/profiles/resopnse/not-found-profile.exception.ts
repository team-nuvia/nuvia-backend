import { ErrorKey, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundProfileException extends NotFoundException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '프로필을 찾지 못했습니다.',
  })
  message: string = '프로필을 찾지 못했습니다.';

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_PROFILE, reason });
  }
}
