import { SuccessResponseDto } from '@common/dto/global-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseUpdateProfileDto extends SuccessResponseDto {
  @ApiProperty({ name: 'message', type: String, example: '프로필 수정 성공' })
  message: string = '프로필 수정 성공';
}
