import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseCreateUserDto extends SuccessResponse {
  @ApiProperty({ name: 'message', type: String, example: '사용자 생성 성공' })
  message: string = '사용자 생성 성공';
}
