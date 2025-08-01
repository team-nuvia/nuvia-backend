import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';

export class DeleteUserResponseDto extends SuccessResponse<null> {
  @ApiPropertyNullable({ description: '사용자 삭제 성공', example: '사용자 삭제 성공' })
  declare message: string;
}
