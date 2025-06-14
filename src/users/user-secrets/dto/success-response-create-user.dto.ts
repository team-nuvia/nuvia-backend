import { SuccessResponseDto } from '@common/dto/global-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseCreateUserDto extends SuccessResponseDto {
  @ApiProperty({ name: 'message', type: String, example: '사용자 생성 성공' })
  message: string = '사용자 생성 성공';
}
