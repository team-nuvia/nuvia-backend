import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from './global-response.dto';

export class LoginTokenDto {
  @ApiProperty({
    description: '액세스 토큰',
    type: String,
    example: '<accessToken>',
  })
  accessToken: string = '<accessToken>';

  @ApiProperty({
    description: '리프레시 토큰',
    type: String,
    example: '<refreshToken>',
  })
  refreshToken: string = '<refreshToken>';
}

export class SuccessLoginResponseDto extends SuccessResponseDto<LoginTokenDto> {
  @ApiProperty({
    description: '토큰',
    type: () => LoginTokenDto,
  })
  payload: LoginTokenDto = new LoginTokenDto();

  @ApiProperty({
    description: '로그인 성공',
    type: String,
    example: '로그인 성공',
  })
  message: string = '로그인 성공';
}

// export const DslLogin = applyDecorators(
//   ApiOperation({
//     summary: '로그인',
//     description: '로그인 정보를 입력하여 로그인합니다.',
//   }),
//   ApiResponse({
//     status: 200,
//     description: '로그인 성공',
//     type: () => SuccessLoginResponseDto,
//   }),
// );
