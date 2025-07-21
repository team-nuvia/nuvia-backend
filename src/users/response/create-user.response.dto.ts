import { SetPropertyNullable } from '@common/decorator/set-property-nullable.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';

export class CreateUserResponseDto extends SuccessResponse {
  @SetPropertyNullable({
    description: '사용자 생성 성공',
    value: '사용자 생성 성공',
  })
  message: string = '사용자 생성 성공';
}
