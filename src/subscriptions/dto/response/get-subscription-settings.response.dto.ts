import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { GetSubscriptionSettingsNestedResponseDto } from './get-subscription-settings.nested.response.dto';

export class GetSubscriptionSettingsResponseDto extends GetResponse<GetSubscriptionSettingsNestedResponseDto> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_SUBSCRIPTION_SETTINGS })
  message: string = ErrorMessage.SUCCESS_GET_SUBSCRIPTION_SETTINGS;

  @ApiProperty({ description: '조직 설정', type: () => GetSubscriptionSettingsNestedResponseDto })
  declare payload: GetSubscriptionSettingsNestedResponseDto;

  constructor(payload: GetSubscriptionSettingsNestedResponseDto = new GetSubscriptionSettingsNestedResponseDto()) {
    super(payload);
  }
}
