import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class GetProfileImageResponse extends GetResponse<Buffer> {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '프로필 이미지 조회 성공',
  })
  message = '프로필 이미지 조회 성공';

  @ApiProperty({
    name: 'payload',
    type: Buffer,
    example: Buffer.from('image.png'),
  })
  declare payload: Buffer;
}
