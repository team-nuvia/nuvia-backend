import { ApiProperty } from '@nestjs/swagger';

export class DailyTrendResponseDto {
  @ApiProperty({ description: '날짜', example: '2024-01-01' })
  date!: string;

  @ApiProperty({ description: '응답 수', example: 100 })
  count!: number;
}
