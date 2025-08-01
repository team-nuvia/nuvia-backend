import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { UserMeNestedResponseDto } from '@common/dto/response/user-me.nested.response.dto';

export class GetUserMeResponseDto extends SuccessResponse {
  @ApiPropertyNullable({ description: '사용자 정보 조회 성공', example: '사용자 정보 조회 성공' })
  message: string = '사용자 정보 조회 성공';

  @ApiPropertyNullable({ description: '사용자 정보', type: UserMeNestedResponseDto })
  declare payload: UserMeNestedResponseDto;
}
