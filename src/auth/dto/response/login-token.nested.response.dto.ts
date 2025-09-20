import { ApiProperty } from '@nestjs/swagger';

export class LoginTokenNestedResponseDto {
  @ApiProperty({ description: '액세스 토큰', example: '<accessToken>' })
  accessToken: string = '<accessToken>';

  @ApiProperty({ description: '리프레시 토큰', example: '<refreshToken>' })
  refreshToken: string = '<refreshToken>';

  @ApiProperty({ description: '세션 토큰', example: '<sessionToken>' })
  hmacSession: string = '<hmacSession>';
}
