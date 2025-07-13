import { CreatedResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileResponse extends CreatedResponse {
  @ApiProperty({ name: 'message', type: String, example: '프로필 생성 성공' })
  message: string = '프로필 생성 성공';
}
