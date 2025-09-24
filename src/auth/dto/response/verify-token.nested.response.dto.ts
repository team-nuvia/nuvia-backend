import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenNestedResponseDto {
  @ApiProperty({ description: '토큰 검증 성공', example: true })
  verified: boolean = true;

  @ApiProperty({ description: '토큰', example: '<token>' })
  token: string = '<token>';
}
