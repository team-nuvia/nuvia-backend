import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginFormPayloadDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@example.com',
  })
  @IsEmail()
  @IsString()
  email!: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'qweQQ!!1',
  })
  @IsString()
  password!: string;
}
