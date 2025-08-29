import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { TableOrganizationRoleNestedResponseDto } from './table-organization-role.nested.response.dto';

export class GetOrganizationRolesResponseDto extends GetResponse<TableOrganizationRoleNestedResponseDto[]> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_ORGANIZATION_ROLES })
  message: string = ErrorMessage.SUCCESS_GET_ORGANIZATION_ROLES;

  @ApiProperty({
    description: '역할 목록',
    type: [TableOrganizationRoleNestedResponseDto],
    isArray: true,
    example: [new TableOrganizationRoleNestedResponseDto()],
  })
  declare payload: TableOrganizationRoleNestedResponseDto[];

  constructor(payload: TableOrganizationRoleNestedResponseDto[] = [new TableOrganizationRoleNestedResponseDto()]) {
    super(payload);
  }
}
