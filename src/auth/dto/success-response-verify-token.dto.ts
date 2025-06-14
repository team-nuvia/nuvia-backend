import { SuccessResponseDto } from '@common/dto/global-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseVerifyTokenDto extends SuccessResponseDto {
  @ApiProperty({ name: 'message', type: String, example: '토큰 검증 성공' })
  message: string = '토큰 검증 성공';
}
