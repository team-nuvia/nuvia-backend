import { SuccessResponseDto } from '@common/dto/global-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseCreateProfileDto extends SuccessResponseDto {
  @ApiProperty({ name: 'message', type: String, example: '프로필 생성 성공' })
  message: string = '프로필 생성 성공';
}
