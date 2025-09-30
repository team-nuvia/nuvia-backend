import { ApiProperty } from '@nestjs/swagger';
import { IsDifferentFrom } from '@users/user-secrets/is-different-from.decorator';
import { IsString } from 'class-validator';

export class ChangePasswordFormPayloadDto {
  @ApiProperty({ description: '이전 비밀번호', example: '이전 비밀번호' })
  @IsString()
  prevPassword!: string;

  @ApiProperty({ description: '새 비밀번호', example: '새 비밀번호' })
  @IsString()
  @IsDifferentFrom('prevPassword')
  newPassword!: string;
}
