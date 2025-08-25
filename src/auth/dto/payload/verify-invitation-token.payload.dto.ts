import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyInvitationTokenPayloadDto {
  @ApiProperty({
    description: '초대 토큰',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
