import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteProfileResponseDto extends SuccessResponse<null> {
  @ApiProperty({ name: 'message', example: '프로필 삭제 성공' })
  declare message: string;
}
