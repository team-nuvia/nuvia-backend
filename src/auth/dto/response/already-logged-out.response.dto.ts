import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class AlreadyLoggedOutResponseDto extends SuccessResponse<null> {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.SUCCESS_LOGOUT,
  })
  message: string = ErrorMessage.SUCCESS_LOGOUT;
}
