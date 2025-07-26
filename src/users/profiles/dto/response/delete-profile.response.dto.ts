import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteProfileResponseDto extends SuccessResponse {
  @ApiProperty({ name: 'message', type: String, example: '프로필 삭제 성공' })
  message: string = '프로필 삭제 성공';
}
