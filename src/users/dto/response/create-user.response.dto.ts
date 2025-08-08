import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';

export class CreateUserResponseDto extends SuccessResponse<null> {
  @ApiPropertyNullable({
    example: ErrorMessage.SUCCESS_CREATE_USER,
  })
  declare message: string;
}
