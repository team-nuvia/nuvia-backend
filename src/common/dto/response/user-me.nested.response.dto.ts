import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@share/enums/user-role';

export class UserMeNestedResponseDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'test@test.com',
  })
  email!: string;

  @ApiProperty({
    description: '사용자 이름',
    example: 'test username',
  })
  username!: string;

  @ApiProperty({
    description: '사용자 닉네임',
    example: 'test nickname',
  })
  nickname!: string;

  @ApiProperty({
    description: '사용자 권한',
    enum: UserRole,
    example: UserRole.Viewer,
  })
  role!: UserRole;
}
