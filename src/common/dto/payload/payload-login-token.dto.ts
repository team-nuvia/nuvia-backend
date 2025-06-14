import { ApiProperty } from '@nestjs/swagger';

export class PayloadLoginTokenDto {
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
