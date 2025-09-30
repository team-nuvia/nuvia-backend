import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserMeResponseDto extends SuccessResponse<null> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_UPDATE_USER })
  message: string = ErrorMessage.SUCCESS_UPDATE_USER;
}
