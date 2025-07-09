import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { PayloadUserSecretDto } from './payload-user-secret.dto';

export class SuccessResponseUpdateUserSecretDto extends SuccessResponse<PayloadUserSecretDto> {
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
