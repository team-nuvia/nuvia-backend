import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionGrantType } from '../../enums/permission-grant-type.enum';

export class CreatePermissionGrantDto {
  @ApiProperty({ description: '권한 PK' })
  permissionId!: number;

  @ApiProperty({ enum: PermissionGrantType, description: '권한 제약사항 유형', example: PermissionGrantType.TeamInvite })
  type!: PermissionGrantType;

  @ApiPropertyOptional({ description: '권한 제약사항 설명' })
  description?: string;

  @ApiProperty({ description: '권한 제약사항 허용 여부' })
  isAllowed!: boolean;
}
