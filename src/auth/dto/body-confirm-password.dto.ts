import { ApiProperty } from '@nestjs/swagger';
import { VerifySecretDto } from '@util/dto/verify-secret.dto';

export class BodyConfirmPasswordDto extends VerifySecretDto {
  @ApiProperty({ name: 'inputPassword', type: String, example: 'qweQQ!!1' })
  inputPassword!: string;
}
