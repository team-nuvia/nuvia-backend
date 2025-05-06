import { ApiProperty } from '@nestjs/swagger';

export class VerifySecretDto {
  @ApiProperty({ name: 'password', type: String, example: 'qweQQ!!1' })
  password!: string;

  @ApiProperty({
    name: 'salt',
    type: String,
    example: '<salt_key>',
  })
  salt!: string;

  @ApiProperty({
    name: 'iteration',
    type: Number,
    example: Math.random() * 50001 + 5000,
  })
  iteration!: number;
}
