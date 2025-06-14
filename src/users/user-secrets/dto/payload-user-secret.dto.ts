import { ApiProperty } from '@nestjs/swagger';

export class PayloadUserSecretDto {
  @ApiProperty({ name: 'id', type: Number, example: 1 })
  id!: number;
}
