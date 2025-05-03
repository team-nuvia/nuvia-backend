import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';

export class ChangePasswordDto {
  @ApiProperty({ name: 'token', type: String, required: true })
  token!: string;

  @ApiProperty({ name: 'password', type: String, required: true })
  password!: string;
}
