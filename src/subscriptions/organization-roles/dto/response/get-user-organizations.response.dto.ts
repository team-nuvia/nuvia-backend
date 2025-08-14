import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserOrganizationsNestedResponseDto } from './get-user-organizations.nested.response.dto';

export class GetUserOrganizationsResponseDto extends GetResponse<GetUserOrganizationsNestedResponseDto> {
  @ApiProperty({
    example: ErrorMessage.SUCCESS_GET_USER_ORGANIZATIONS,
  })
  message: string = ErrorMessage.SUCCESS_GET_USER_ORGANIZATIONS;

  @ApiProperty({
    type: () => GetUserOrganizationsNestedResponseDto,
    example: new GetUserOrganizationsNestedResponseDto(),
  })
  declare payload: GetUserOrganizationsNestedResponseDto;

  constructor(payload: GetUserOrganizationsNestedResponseDto = new GetUserOrganizationsNestedResponseDto()) {
    super(payload);
  }
}
