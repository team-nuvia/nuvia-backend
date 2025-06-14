import { ApiProperty } from '@nestjs/swagger';

export class BodyChangePasswordDto {
  @ApiProperty({ name: 'prevPassword', type: String, example: 'qweQQ!!1' })
  prevPassword!: string;

  @ApiProperty({ name: 'newPassword', type: String, example: 'qweQQ!!1' })
  newPassword!: string;
}
