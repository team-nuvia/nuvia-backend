import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { UserSecretNestedParamDto } from './user-secret.nested.param.dto';

export class UpdateUserSecretResponseDto extends SuccessResponse<UserSecretNestedParamDto> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_UPDATE_USER_SECRET })
  message: string = ErrorMessage.SUCCESS_UPDATE_USER_SECRET;

  @ApiProperty({ description: ErrorMessage.SUCCESS_UPDATE_USER_SECRET, type: () => UserSecretNestedParamDto })
  declare payload: UserSecretNestedParamDto;

  constructor(payload: UserSecretNestedParamDto = new UserSecretNestedParamDto()) {
    super(payload);
  }
}
