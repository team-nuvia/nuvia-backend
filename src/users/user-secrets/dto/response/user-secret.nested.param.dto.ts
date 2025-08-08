import { ApiProperty } from '@nestjs/swagger';

export class UserSecretNestedParamDto {
  @ApiProperty({ description: 'id', example: 1 })
  id: number = 1;
}
