import { CreatedResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileResponseDto extends CreatedResponse<null> {
  @ApiProperty({ name: 'message', example: '프로필 생성 성공' })
  declare message: string;
}
