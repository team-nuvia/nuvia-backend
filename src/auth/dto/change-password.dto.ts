import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ name: 'token', type: String, required: true })
  token!: string;

  @ApiProperty({ name: 'password', type: String, required: true })
  password!: string;
}
