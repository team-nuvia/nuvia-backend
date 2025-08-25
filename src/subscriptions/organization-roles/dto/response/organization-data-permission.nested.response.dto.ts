import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@share/enums/user-role';
import { IPermission } from '@share/interface/ipermission';
import { OrganizationDataPermissionGrantsNestedResponseDto } from './organization-data-permission-grants.nested.response.dto';

export class OrganizationDataPermissionNestedResponseDto implements IPermission {
  @ApiProperty({
    example: 1,
  })
  id: number = 1;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.Owner,
  })
  role: UserRole = UserRole.Owner;

  @ApiPropertyNullable({
    example: '권한 설명',
  })
  description: string | null = '권한 설명';

  @ApiProperty({
    example: 1,
  })
  sequence: number = 1;

  @ApiProperty({
    example: 0,
  })
  isDeprecated: boolean = false;

  @ApiProperty({
    example: 1,
  })
  isDefault: boolean = true;

  @ApiProperty({
    type: () => OrganizationDataPermissionGrantsNestedResponseDto,
    isArray: true,
    example: [new OrganizationDataPermissionGrantsNestedResponseDto()],
  })
  permissionGrants: OrganizationDataPermissionGrantsNestedResponseDto[] = [new OrganizationDataPermissionGrantsNestedResponseDto()];

  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date = new Date();

  @ApiProperty({
    example: new Date(),
  })
  updatedAt: Date = new Date();
}
