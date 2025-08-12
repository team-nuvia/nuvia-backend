import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto extends SuccessResponse<null> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_LOGOUT })
  message: string = ErrorMessage.SUCCESS_LOGOUT;

  constructor(payload: null = null) {
    super(payload);
  }
}
