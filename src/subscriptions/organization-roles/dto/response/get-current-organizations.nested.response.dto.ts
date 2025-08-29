import { ApiProperty } from '@nestjs/swagger';
import { CurrentOrganizationNestedResponseDto } from './current-organization.nested.response.dto';

export class GetCurrentOrganizationsNestedResponseDto {
  @ApiProperty({
    type: () => CurrentOrganizationNestedResponseDto,
    example: new CurrentOrganizationNestedResponseDto(),
  })
  currentOrganization: CurrentOrganizationNestedResponseDto = new CurrentOrganizationNestedResponseDto();

  @ApiProperty({
    type: () => CurrentOrganizationNestedResponseDto,
    isArray: true,
    example: [new CurrentOrganizationNestedResponseDto()],
  })
  organizations: CurrentOrganizationNestedResponseDto[] = [new CurrentOrganizationNestedResponseDto()];
}
