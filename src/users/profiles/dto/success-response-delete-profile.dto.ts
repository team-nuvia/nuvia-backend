import { SuccessResponseDto } from '@common/dto/global-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDeleteProfileDto extends SuccessResponseDto {
  @ApiProperty({ name: 'message', type: String, example: '프로필 삭제 성공' })
  message: string = '프로필 삭제 성공';
}
