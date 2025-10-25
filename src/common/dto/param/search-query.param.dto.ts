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
  @Min(1, { message: '페이지는 최소 1까지 가능합니다.' })
  page: number = 1;

  @ApiProperty({
    description: '페이지 크기',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(5, { message: '페이지 크기는 최소 5까지 가능합니다.' })
  @Max(20, { message: '페이지 크기는 최대 20까지 가능합니다.' })
  limit: number = 10;
}
