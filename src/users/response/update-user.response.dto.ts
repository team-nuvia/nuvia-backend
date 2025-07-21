import { SetPropertyNullable } from '@common/decorator/set-property-nullable.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';

export class UpdateUserResponseDto extends SuccessResponse {
  @SetPropertyNullable({
    description: '사용자 정보',
    value: 1,
  })
  payload: number = 1;

  @SetPropertyNullable({
    description: '사용자 정보 수정 성공',
    value: '사용자 정보 수정 성공',
  })
  message: string = '사용자 정보 수정 성공';
}
