import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchQueryParamDto {
  @ApiProperty({
    description: '검색어',
    required: false,
  })
  @IsOptional()
  @IsString()
  search!: string;

  @ApiProperty({
    description: '페이지',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: '페이지 크기',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(20)
  limit: number = 10;
}
