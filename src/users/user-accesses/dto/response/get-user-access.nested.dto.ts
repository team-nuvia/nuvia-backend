import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { UserAccessStatusType } from '@users/user-accesses/enums/user-access-status-type';

export class UserSimpleInfoNestedDto {
  @ApiProperty({ description: '유저 아이디', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '유저 이름', example: 'John Doe' })
  name: string = 'John Doe';

  @ApiProperty({ description: '유저 이메일', example: 'john.doe@example.com' })
  email: string = 'john.doe@example.com';

  @ApiProperty({ description: '유저 이름', example: 'John Doe' })
  nickname: string = 'John Doe';
}

export class GetUserAccessNestedDto {
  @ApiProperty({ description: '접속 ID', example: 1 })
  id: number = 0;

  @ApiProperty({ description: '접속 IP', example: '127.0.0.1' })
  accessIp: string = '127.0.0.1';

  @ApiPropertyNullable({ description: '접속 디바이스', example: 'Chrome' })
  accessDevice: string | null = 'Chrome';

  @ApiPropertyNullable({ description: '접속 브라우저', example: 'Chrome' })
  accessBrowser: string | null = 'Chrome';

  @ApiPropertyNullable({ description: '접속 유저 에이전트', example: 'Chrome' })
  accessUserAgent: string | null = 'Chrome';

  @ApiProperty({ description: '접속 상태', enum: UserAccessStatusType, example: UserAccessStatusType.Login })
  status: UserAccessStatusType = UserAccessStatusType.Login;

  @ApiPropertyNullable({ description: '접속 시간', example: new Date() })
  lastAccessAt: Date | null = new Date();

  @ApiProperty({ description: '유저 정보', type: () => UserSimpleInfoNestedDto })
  user: UserSimpleInfoNestedDto = new UserSimpleInfoNestedDto();
}
