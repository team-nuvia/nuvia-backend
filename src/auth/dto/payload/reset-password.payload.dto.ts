import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserLoginInformationPayloadDto } from './user-login-information.payload.dto';

export class ResetPasswordPayloadDto extends UserLoginInformationPayloadDto {
  @ApiProperty({
    description: '비밀번호 확인',
    example: 'qweQQ!!1',
  })
  @IsString()
  confirmPassword!: string;

  @ApiProperty({
    description: '인증 토큰',
    example: '<token>',
  })
  @IsString()
  token!: string;

  @ApiProperty({
    description: 'OTP 토큰',
    example: '123456',
  })
  @IsString()
  otpToken!: string;
}
