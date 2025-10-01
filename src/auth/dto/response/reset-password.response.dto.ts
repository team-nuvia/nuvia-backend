import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponseDto extends SuccessResponse<null> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_RESET_PASSWORD })
  message: string = ErrorMessage.SUCCESS_RESET_PASSWORD;
}
