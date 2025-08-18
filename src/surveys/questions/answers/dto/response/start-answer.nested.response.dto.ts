import { ApiProperty } from '@nestjs/swagger';

export class StartAnswerNestedResponseDto {
  @ApiProperty({
    description: '응답자 제출 해시',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  })
  submissionHash: string = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

  @ApiProperty({
    description: '설문 인증 JWS 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbnN3ZXJJZCI6MSwiU3VydmV5SWQiOjF9.abc123def456',
  })
  jwsToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbnN3ZXJJZCI6MSwiU3VydmV5SWQiOjF9.abc123def456';
}
