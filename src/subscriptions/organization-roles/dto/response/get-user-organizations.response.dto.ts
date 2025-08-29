import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { GetCurrentOrganizationsNestedResponseDto } from './get-current-organizations.nested.response.dto';

export class GetUserOrganizationsResponseDto extends GetResponse<GetCurrentOrganizationsNestedResponseDto> {
  @ApiProperty({
    example: ErrorMessage.SUCCESS_GET_USER_ORGANIZATIONS,
  })
  message: string = ErrorMessage.SUCCESS_GET_USER_ORGANIZATIONS;

  @ApiProperty({
    type: () => GetCurrentOrganizationsNestedResponseDto,
    example: new GetCurrentOrganizationsNestedResponseDto(),
  })
  declare payload: GetCurrentOrganizationsNestedResponseDto;

  constructor(payload: GetCurrentOrganizationsNestedResponseDto = new GetCurrentOrganizationsNestedResponseDto()) {
    super(payload);
  }
}
