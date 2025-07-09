import { ApiProperty } from '@nestjs/swagger';
import { NotFoundResponseDto } from '../global-response.dto';

export class NotFoundResponseUserDto extends NotFoundResponseDto {
  @ApiProperty({
    description: '사용자를 찾지 못했습니다.',
    type: String,
    example: '사용자를 찾지 못했습니다.',
  })
  declare message: string;

  constructor(reason: string | null = null) {
    super(reason, '사용자를 찾지 못했습니다.');
  }
}
