import { SetProperty } from '@common/decorator/set-property.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';

export class CreateUserSecretResponseDto extends SuccessResponse {
  @SetProperty({
    description: '비밀번호 생성 성공',
    value: '비밀번호 생성 성공',
  })
  message: string = '비밀번호 생성 성공';
}
