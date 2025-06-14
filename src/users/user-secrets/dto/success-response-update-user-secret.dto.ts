import { SuccessResponseDto } from '@common/dto/global-response.dto';
import { PayloadUserSecretDto } from './payload-user-secret.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseUpdateUserSecretDto extends SuccessResponseDto<PayloadUserSecretDto> {
  @ApiProperty({
    name: 'payload',
    type: () => PayloadUserSecretDto,
    example: new PayloadUserSecretDto(),
  })
  declare payload: PayloadUserSecretDto;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '비밀번호 변경',
  })
  message: string = '비밀번호 변경 성공';
}
