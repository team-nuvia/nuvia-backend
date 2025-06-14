import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from '../global-response.dto';
import { PayloadLoginTokenDto } from '../payload/payload-login-token.dto';

export class SuccessResponseLoginDto extends SuccessResponseDto<PayloadLoginTokenDto> {
  @ApiProperty({
    description: '토큰',
    type: () => PayloadLoginTokenDto,
  })
  payload: PayloadLoginTokenDto = new PayloadLoginTokenDto();

  @ApiProperty({
    description: '로그인 성공',
    type: String,
    example: '로그인 성공',
  })
  message: string = '로그인 성공';
}
