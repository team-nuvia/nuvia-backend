import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserSettingsNestedResponseDto } from './get-user-settings.nested.response.dto';

export class GetUserSettingsResponseDto extends GetResponse<GetUserSettingsNestedResponseDto> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_USER_SETTINGS })
  message: string = ErrorMessage.SUCCESS_GET_USER_SETTINGS;

  @ApiProperty({ description: '사용자 설정', type: () => GetUserSettingsNestedResponseDto })
  declare payload: GetUserSettingsNestedResponseDto;

  constructor(payload: GetUserSettingsNestedResponseDto = new GetUserSettingsNestedResponseDto()) {
    super(payload);
  }
}
