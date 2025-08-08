import { ApiProperty } from '@nestjs/swagger';

export class LoginFormPayloadDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@example.com',
  })
  email!: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'qweQQ!!1',
  })
  password!: string;
}
