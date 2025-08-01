import { NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundProfileImageException extends NotFoundException {
  @ApiProperty({
    name: 'message',
    example: '프로필 이미지를 찾을 수 없습니다.',
  })
  declare message: string;
}
