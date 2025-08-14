import { ApiProperty } from '@nestjs/swagger';
import { OrganizationDataNestedResponseDto } from './organization-data.nested.response.dto';

export class GetUserOrganizationsNestedResponseDto {
  @ApiProperty({
    type: () => OrganizationDataNestedResponseDto,
    example: new OrganizationDataNestedResponseDto(),
  })
  currentOrganization: OrganizationDataNestedResponseDto = new OrganizationDataNestedResponseDto();

  @ApiProperty({
    type: () => OrganizationDataNestedResponseDto,
    isArray: true,
    example: [new OrganizationDataNestedResponseDto()],
  })
  organizations: OrganizationDataNestedResponseDto[] = [new OrganizationDataNestedResponseDto()];
}
