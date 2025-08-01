import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';

export class UpdateUserResponseDto extends SuccessResponse {
  @ApiPropertyNullable({ description: '사용자 정보', example: 1 })
  payload: number = 1;

  @ApiPropertyNullable({ description: '사용자 정보 수정 성공', example: '사용자 정보 수정 성공' })
  message: string = '사용자 정보 수정 성공';
}
