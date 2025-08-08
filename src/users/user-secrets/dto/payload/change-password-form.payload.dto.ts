import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordFormPayloadDto {
  @ApiProperty({ description: '이전 비밀번호', example: '이전 비밀번호' })
  prevPassword!: string;

  @ApiProperty({ description: '새 비밀번호', example: '새 비밀번호' })
  newPassword!: string;
}
