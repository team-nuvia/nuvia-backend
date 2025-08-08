import { ApiProperty } from '@nestjs/swagger';

export class VerifySecretDto {
  @ApiProperty({ example: 'qweQQ!!1' })
  password!: string;

  @ApiProperty({ example: '<salt_key>' })
  salt!: string;

  @ApiProperty({ example: Math.random() * 50001 + 5000 })
  iteration!: number;
}
