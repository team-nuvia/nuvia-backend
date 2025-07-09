import { NotFoundResponseDto } from '@common/dto/global-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponseEmailDto extends NotFoundResponseDto {
  @ApiProperty({
    description: '이메일을 찾지 못했습니다.',
    type: String,
    example: '이메일을 찾지 못했습니다.',
  })
  declare message: string;

  constructor(reason: string | null = null) {
    super(reason, '이메일을 찾지 못했습니다.');
  }
}
