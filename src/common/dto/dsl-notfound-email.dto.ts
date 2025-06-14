import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './global-response.dto';

export class NotFoundEmailResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: '이메일을 찾지 못했습니다.',
    type: String,
    example: '이메일을 찾지 못했습니다.',
  })
  message: string = '이메일을 찾지 못했습니다.';
}
