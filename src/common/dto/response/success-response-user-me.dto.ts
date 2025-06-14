import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from '../global-response.dto';
import { PayloadUserMeDto } from '../payload/payload-user-me.dto';

export class SuccessResponseUserMeDto extends SuccessResponseDto<PayloadUserMeDto> {
  @ApiProperty({
    description: '사용자 정보',
    type: () => PayloadUserMeDto,
  })
  payload: PayloadUserMeDto = new PayloadUserMeDto();

  @ApiProperty({
    description: '사용자 정보 조회 성공',
    type: String,
    example: '사용자 정보 조회 성공',
  })
  message: string = '사용자 정보 조회 성공';
}
