import { SuccessResponseDto } from '@common/dto/global-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDeleteUserDto extends SuccessResponseDto {
  @ApiProperty({ name: 'message', type: String, example: '사용자 삭제 성공' })
  message: string = '사용자 삭제 성공';
}
