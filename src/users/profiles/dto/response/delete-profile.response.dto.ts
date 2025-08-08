import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteProfileResponseDto extends SuccessResponse<null> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_DELETE_PROFILE })
  message: string = ErrorMessage.SUCCESS_DELETE_PROFILE;
}
