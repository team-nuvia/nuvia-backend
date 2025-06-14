import { SuccessResponseDto } from '@common/dto/global-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseGetProfileImageDto extends SuccessResponseDto {
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
