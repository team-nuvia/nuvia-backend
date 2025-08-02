import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@share/enums/user-role';

export class GetUserMeNestedResponseDto {
  @ApiProperty({ example: 1 })
  id: number = 1;

  @ApiProperty({ example: 'example@example.com' })
  email: string = 'example@example.com';

  @ApiProperty({ example: 'username' })
  username: string = 'username';

  @ApiProperty({ example: 'nickname' })
  nickname: string = 'nickname';

  @ApiProperty({ enum: UserRole, example: UserRole.Admin })
  role: UserRole = UserRole.Admin;

  @ApiProperty({ example: new Date() })
  createdAt: Date = new Date();

  @ApiPropertyNullable({ example: 'https://example.com/profile.png' })
  profileImageUrl: string | null = 'https://example.com/profile.png';
}
