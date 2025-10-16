import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { UserRole } from '@share/enums/user-role';
import { GetUserMeOrganizationNestedResponseDto } from './get-user-me-organization.nested.response.dto';

export class GetUserMeNestedResponseDto {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '이메일', example: 'example@example.com' })
  email: string = 'example@example.com';

  @ApiProperty({ description: '이름', example: 'name' })
  name: string = 'name';

  @ApiProperty({ description: '닉네임', example: 'nickname' })
  nickname: string = 'nickname';

  @ApiProperty({ enum: UserRole, description: '역할', example: UserRole.Admin })
  role: UserRole = UserRole.Admin;

  @ApiProperty({ description: '이용약관 및 개인정보 처리방침 동의 여부', example: true })
  termsAgreed: boolean = true;

  @ApiProperty({ description: '공급자', enum: SocialProvider, example: SocialProvider.Google })
  provider: SocialProvider = SocialProvider.Google;

  @ApiProperty({
    type: () => GetUserMeOrganizationNestedResponseDto,
    description: '현재 조직 정보',
    example: new GetUserMeOrganizationNestedResponseDto(),
  })
  currentOrganization: GetUserMeOrganizationNestedResponseDto = new GetUserMeOrganizationNestedResponseDto();

  @ApiProperty({ description: '생성 일시', example: new Date() })
  createdAt: Date = new Date();

  @ApiProperty({ description: '수정 일시', example: new Date() })
  updatedAt: Date = new Date();

  @ApiPropertyNullable({ description: '최근 로그인 일시', example: new Date() })
  lastAccessAt: Date | null = new Date();

  @ApiPropertyNullable({ description: '최근 비밀번호 수정 일시', example: new Date() })
  lastUpdatedAt: Date | null = new Date();

  @ApiPropertyNullable({ description: '프로필 이미지 URL', example: 'https://example.com/profile.png' })
  profileImageUrl: string | null = 'https://example.com/profile.png';
}
