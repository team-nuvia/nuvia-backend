import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@share/enums/user-role';
import { GetUserMeOrganizationNestedResponseDto } from './get-user-me-organization.nested.response.dto';

export class GetUserMeNestedResponseDto {
  @ApiProperty({ example: 1 })
  id: number = 1;

  @ApiProperty({ example: 'example@example.com' })
  email: string = 'example@example.com';

  @ApiProperty({ example: 'name' })
  name: string = 'name';

  @ApiProperty({ example: 'nickname' })
  nickname: string = 'nickname';

  @ApiProperty({ enum: UserRole, example: UserRole.Admin })
  role: UserRole = UserRole.Admin;

  @ApiProperty({
    type: () => GetUserMeOrganizationNestedResponseDto,
    description: '현재 조직 정보',
    example: new GetUserMeOrganizationNestedResponseDto(),
  })
  currentOrganization: GetUserMeOrganizationNestedResponseDto = new GetUserMeOrganizationNestedResponseDto();

  @ApiProperty({ example: new Date() })
  createdAt: Date = new Date();

  @ApiPropertyNullable({ example: 'https://example.com/profile.png' })
  profileImageUrl: string | null = 'https://example.com/profile.png';
}
