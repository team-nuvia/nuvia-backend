import { ApiProperty } from '@nestjs/swagger';

export class GetCategoryNestedResponseDto {
  @ApiProperty({ description: '카테고리 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '카테고리 이름', example: '카테고리1' })
  name: string = '카테고리1';
}
