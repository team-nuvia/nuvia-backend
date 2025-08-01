import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileResponseDto extends SuccessResponse<null> {
  @ApiProperty({ name: 'message', example: '프로필 수정 성공' })
  declare message: string;
}
