import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@share/enums/user-role';

export class GetSubscriptionSettingsNestedResponseDto {
  @ApiProperty({ description: '팀 이름', example: '팀 이름' })
  teamName: string = '팀 이름';

  @ApiPropertyNullable({ description: '팀 설명', example: '팀 설명' })
  teamDescription: string | null = '팀 설명';

  @ApiProperty({ description: '팀 기본 역할', enum: UserRole, example: UserRole.Owner })
  teamDefaultRole: UserRole = UserRole.Owner;
}
