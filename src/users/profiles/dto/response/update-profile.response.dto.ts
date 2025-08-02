import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileResponseDto extends SuccessResponse<null> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_UPDATE_PROFILE })
  message: string = ErrorMessage.SUCCESS_UPDATE_PROFILE;
}
