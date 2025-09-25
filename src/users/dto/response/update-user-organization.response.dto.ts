import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserCurrentOrganizationResponseDto extends SuccessResponse<void> {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.SUCCESS_UPDATE_USER_ORGANIZATION,
  })
  message: string = ErrorMessage.SUCCESS_UPDATE_USER_ORGANIZATION;
}
