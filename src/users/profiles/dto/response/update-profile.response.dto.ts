import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileResponseDto extends SuccessResponse {
  @ApiProperty({ name: 'message', type: String, example: '프로필 수정 성공' })
  message: string = '프로필 수정 성공';
}
