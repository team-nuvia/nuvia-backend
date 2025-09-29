import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto extends SuccessResponse<null> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_DELETE_USER })
  message: string = ErrorMessage.SUCCESS_DELETE_USER;
}
