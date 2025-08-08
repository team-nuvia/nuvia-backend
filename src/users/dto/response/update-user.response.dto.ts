import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';

export class UpdateUserResponseDto extends SuccessResponse<number> {
  @ApiPropertyNullable({ example: ErrorMessage.SUCCESS_UPDATE_USER })
  message: string = ErrorMessage.SUCCESS_UPDATE_USER;

  @ApiPropertyNullable({ description: ErrorMessage.SUCCESS_UPDATE_USER, example: 1 })
  declare payload: number;

  constructor(payload: number = 1) {
    super(payload);
  }
}
