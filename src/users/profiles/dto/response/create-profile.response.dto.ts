import { ErrorMessage } from '@common/dto/response';
import { CreatedResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileResponseDto extends CreatedResponse<null> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_CREATE_PROFILE })
  message: string = ErrorMessage.SUCCESS_CREATE_PROFILE;
}
