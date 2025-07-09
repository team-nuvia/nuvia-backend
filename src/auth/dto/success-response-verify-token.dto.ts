import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseVerifyTokenDto extends SuccessResponse {
  @ApiProperty({ name: 'message', type: String, example: '토큰 검증 성공' })
  message: string = '토큰 검증 성공';
}
