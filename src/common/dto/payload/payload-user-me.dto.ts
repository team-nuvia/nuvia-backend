import { UserRole } from '@common/variable/enums';
import { ApiProperty } from '@nestjs/swagger';

export class PayloadUserMeDto {
  @ApiProperty({
    description: '사용자 이메일',
    type: String,
    example: 'test@test.com',
  })
  email: string = 'test@test.com';

  @ApiProperty({
    description: '사용자 이름',
    type: String,
    example: 'test username',
  })
  username: string = 'test username';

  @ApiProperty({
    description: '사용자 닉네임',
    type: String,
    example: 'test nickname',
  })
  nickname: string = 'test nickname';

  @ApiProperty({
    description: '사용자 권한',
    enum: UserRole,
    example: UserRole.User,
  })
  role: UserRole = UserRole.User;
}
