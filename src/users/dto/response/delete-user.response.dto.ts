import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';

export class DeleteUserResponseDto extends SuccessResponse<null> {
  @ApiPropertyNullable({ example: ErrorMessage.SUCCESS_DELETE_USER })
  message: string = ErrorMessage.SUCCESS_DELETE_USER;
}
