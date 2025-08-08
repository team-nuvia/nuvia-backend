import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationResponseDto extends SuccessResponse<null> {
  @ApiProperty({
    example: ErrorMessage.UPDATE_ORGANIZATION_SUCCESS,
  })
  declare message: string;
}
