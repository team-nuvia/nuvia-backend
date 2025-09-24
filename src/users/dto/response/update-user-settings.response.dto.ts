import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingsResponseDto extends SuccessResponse<void> {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.SUCCESS_UPDATE_USER_SETTINGS,
  })
  message: string = ErrorMessage.SUCCESS_UPDATE_USER_SETTINGS;
}
