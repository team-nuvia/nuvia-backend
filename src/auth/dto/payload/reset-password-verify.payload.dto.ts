import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordVerifyPayloadDto {
  @ApiProperty({
    description: '인증 토큰',
    example: '<token>',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  token!: string;

  @ApiProperty({
    description: 'OTP 토큰',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  otpToken!: string;
}
