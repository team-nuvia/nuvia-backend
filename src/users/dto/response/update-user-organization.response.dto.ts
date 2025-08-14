import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserOrganizationResponseDto extends GetResponse<void> {
  @ApiProperty({
    example: ErrorMessage.SUCCESS_UPDATE_USER_ORGANIZATION,
  })
  message: string = ErrorMessage.SUCCESS_UPDATE_USER_ORGANIZATION;
}
