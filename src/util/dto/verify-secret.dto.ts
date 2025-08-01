import { ApiProperty } from '@nestjs/swagger';

export class VerifySecretDto {
  @ApiProperty({ name: 'password', example: 'qweQQ!!1' })
  password!: string;

  @ApiProperty({
    name: 'salt',
    example: '<salt_key>',
  })
  salt!: string;

  @ApiProperty({
    name: 'iteration',
    example: Math.random() * 50001 + 5000,
  })
  iteration!: number;
}
