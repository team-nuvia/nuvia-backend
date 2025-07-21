import { SetPropertyNullable } from '@common/decorator/set-property-nullable.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { UserMeNestedResponseDto } from '@common/dto/response/user-me.nested.response.dto';
import { HttpStatus } from '@nestjs/common';

export class GetUserMeResponseDto extends SuccessResponse {
  @SetPropertyNullable({
    description: '사용자 정보',
    value: UserMeNestedResponseDto,
  })
  payload: UserMeNestedResponseDto = new UserMeNestedResponseDto();

  @SetPropertyNullable({
    description: '사용자 정보 조회 성공',
    value: '사용자 정보 조회 성공',
  })
  message: string = '사용자 정보 조회 성공';

  constructor(payload: UserMeNestedResponseDto) {
    super(HttpStatus.OK, payload);
  }
}
