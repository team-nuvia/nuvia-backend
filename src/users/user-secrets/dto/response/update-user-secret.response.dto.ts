import { SetProperty } from '@common/decorator/set-property.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { UserSecretNestedParamDto } from '../param/user-secret.nested.param.dto';

export class UpdateUserSecretResponseDto extends SuccessResponse<UserSecretNestedParamDto> {
  @SetProperty({
    description: '비밀번호 변경 성공',
    value: UserSecretNestedParamDto,
  })
  payload: UserSecretNestedParamDto = new UserSecretNestedParamDto();

  @SetProperty({
    description: '비밀번호 변경 성공',
    value: '비밀번호 변경 성공',
  })
  message: string = '비밀번호 변경 성공';
}
