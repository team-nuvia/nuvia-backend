import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubscriptionSettingsResponseDto extends SuccessResponse<void> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_UPDATE_SUBSCRIPTION_SETTINGS })
  message: string = ErrorMessage.SUCCESS_UPDATE_SUBSCRIPTION_SETTINGS;
}
