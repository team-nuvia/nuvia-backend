import { ApiProperty } from '@nestjs/swagger';

export class LoginTokenNestedResponseDto {
  @ApiProperty({ description: '액세스 토큰', example: '<accessToken>' })
  accessToken!: string;

  @ApiProperty({ description: '리프레시 토큰', example: '<refreshToken>' })
  refreshToken!: string;
}
