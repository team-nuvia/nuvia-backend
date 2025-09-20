import { ApiProperty } from '@nestjs/swagger';

export class VerifySessionNestedResponseDto {
  @ApiProperty({ description: '세션 검증 성공', example: true })
  verified: boolean = true;
}
