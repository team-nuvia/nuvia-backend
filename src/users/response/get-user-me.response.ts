import { SetPropertyNullable } from '@common/decorator/set-property-nullable.decorator';
import { PayloadUserMeDto } from '@common/dto/payload/payload-user-me.dto';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { HttpStatus } from '@nestjs/common';

export class GetUserMeResponse extends SuccessResponse {
  @SetPropertyNullable({
    description: '사용자 정보',
    value: PayloadUserMeDto,
  })
  payload: PayloadUserMeDto = new PayloadUserMeDto();

  @SetPropertyNullable({
    description: '사용자 정보 조회 성공',
    value: '사용자 정보 조회 성공',
  })
  message: string = '사용자 정보 조회 성공';

  constructor(payload: PayloadUserMeDto) {
    super(HttpStatus.OK, payload);
  }
}
