import { NotFoundResponseDto } from '@common/dto/global-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponseProfileDto extends NotFoundResponseDto {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '프로필을 찾지 못했습니다.',
  })
  message: string = '프로필을 찾지 못했습니다.';
}
