import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDiscountDto {
  @ApiProperty({ description: '플랜 PK' })
  planId!: number;

  @ApiProperty({ description: '할인 이름' })
  name!: string;

  @ApiProperty({ description: '할인 유형' })
  type!: string;

  @ApiProperty({ description: '할인 금액(원)', required: false })
  discountAmount!: number;

  @ApiProperty({ description: '할인 퍼센트', required: false })
  discountPercentage!: number;

  @ApiProperty({ description: '할인 시작일', required: false })
  startDate!: Date;

  @ApiProperty({ description: '할인 종료일', required: false })
  endDate!: Date;

  @ApiProperty({ description: '할인 코드', required: false })
  code!: string;
}
