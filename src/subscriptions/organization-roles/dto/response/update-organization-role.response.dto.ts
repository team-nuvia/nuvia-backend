import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationRoleResponseDto extends SuccessResponse<null> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_UPDATE_ORGANIZATION_ROLE })
  message: string = ErrorMessage.SUCCESS_UPDATE_ORGANIZATION_ROLE;
}
