import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseUpdateUserDto extends SuccessResponse {
  @ApiProperty({
    name: 'payload',
    type: Number,
    example: 1,
  })
  payload: number = 1;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '사용자 정보 수정 성공',
  })
  message: string = '사용자 정보 수정 성공';
}
