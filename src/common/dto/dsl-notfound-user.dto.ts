import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './global-response.dto';

export class NotFoundUserResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: '사용자를 찾지 못했습니다.',
    type: String,
    example: '사용자를 찾지 못했습니다.',
  })
  message: string = '사용자를 찾지 못했습니다.';
}
