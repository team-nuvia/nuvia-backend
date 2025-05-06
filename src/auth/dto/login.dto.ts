import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ name: 'email', type: String, example: 'test@example.com' })
  email!: string;

  @ApiProperty({ name: 'password', type: String, example: 'qweQQ!!1' })
  password!: string;
}
