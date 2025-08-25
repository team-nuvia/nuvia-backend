import { ApiProperty } from '@nestjs/swagger';
import { IPermissionGrant } from '@share/interface/ipermission';

export class OrganizationDataPermissionGrantsNestedResponseDto implements IPermissionGrant {
  @ApiProperty({
    example: 1,
  })
  id: number = 1;

  @ApiProperty({
    example: 1,
  })
  permissionId: number = 1;

  @ApiProperty({
    example: '권한 유형',
  })
  type: string = '권한 유형';

  @ApiProperty({
    example: '권한 설명',
  })
  description: string | null = '권한 설명';

  @ApiProperty({
    example: true,
  })
  isAllowed: boolean = true;

  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date = new Date();

  @ApiProperty({
    example: new Date(),
  })
  updatedAt: Date = new Date();
}
