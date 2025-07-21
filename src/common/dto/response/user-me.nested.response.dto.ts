import { SetProperty } from '@common/decorator/set-property.decorator';
import { UserRole } from '@common/variable/enums';

export class UserMeNestedResponseDto {
  @SetProperty({
    description: '사용자 이메일',
    value: 'test@test.com',
  })
  email: string = 'test@test.com';

  @SetProperty({
    description: '사용자 이름',
    value: 'test username',
  })
  username: string = 'test username';

  @SetProperty({
    description: '사용자 닉네임',
    value: 'test nickname',
  })
  nickname: string = 'test nickname';

  @SetProperty({
    description: '사용자 권한',
    enum: UserRole,
    value: UserRole.User,
  })
  role: UserRole = UserRole.User;
}
