import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordVerifyResponseDto extends SuccessResponse<null> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_RESET_PASSWORD_VERIFY })
  message: string = ErrorMessage.SUCCESS_RESET_PASSWORD_VERIFY;
}
