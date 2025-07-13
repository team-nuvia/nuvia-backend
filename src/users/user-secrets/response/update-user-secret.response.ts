import { SetProperty } from '@common/decorator/set-property.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { PayloadUserSecretDto } from '../dto/payload-user-secret.dto';

export class UpdateUserSecretResponse extends SuccessResponse<PayloadUserSecretDto> {
  @SetProperty({
    description: '비밀번호 변경 성공',
    value: PayloadUserSecretDto,
  })
  payload: PayloadUserSecretDto = new PayloadUserSecretDto();

  @SetProperty({
    description: '비밀번호 변경 성공',
    value: '비밀번호 변경 성공',
  })
  message: string = '비밀번호 변경 성공';
}
