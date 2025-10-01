import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordSendPayloadDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@test.com',
  })
  @IsEmail()
  @IsString()
  email!: string;

  @ApiProperty({
    description: '인증 토큰',
    example: '<token>',
  })
  @IsString()
  token!: string;
}
