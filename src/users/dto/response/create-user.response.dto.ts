import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';

export class CreateUserResponseDto extends SuccessResponse {
  @ApiPropertyNullable({
    description: '사용자 생성 성공',
    example: '사용자 생성 성공',
  })
  message: string = '사용자 생성 성공';
}
