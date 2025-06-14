import { UserRole } from '@common/variable/enums';
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from './global-response.dto';

export class UserMeDataDto {
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

export class SuccessUserMeResponseDto extends SuccessResponseDto<UserMeDataDto> {
  @ApiProperty({
    description: '사용자 정보',
    type: () => UserMeDataDto,
  })
  payload: UserMeDataDto = new UserMeDataDto();

  @ApiProperty({
    description: '사용자 정보 조회 성공',
    type: String,
    example: '사용자 정보 조회 성공',
  })
  message: string = '사용자 정보 조회 성공';
}

// export const DslUserMe = applyDecorators(
//   ApiOperation({
//     summary: '로그인 사용자 정보 조회',
//     description: '로그인 사용자 정보를 조회합니다.',
//   }),
//   ApiResponse({
//     status: 200,
//     description: '로그인 사용자 정보 조회 성공',
//     type: () => SuccessUserMeResponseDto,
//   }),
// );
