import { ApiProperty } from '@nestjs/swagger';

export class GetSurveyGraphNestedResponseDto {
  @ApiProperty({
    description: '그래프 데이터 날짜',
    example: '2025-08-25',
  })
  date!: string;

  @ApiProperty({
    description: '그래프 데이터 개수',
    example: 10,
  })
  count!: number;
}
