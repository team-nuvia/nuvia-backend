import { PlanGrantConstraintsTypeList } from '@/plans/enums/plan-grant-constraints-type.enum';
import { PlanGrantType } from '@/plans/enums/plan-grant-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizationDataPlanGrantNestedResponseDto {
  @ApiProperty({
    example: 1,
  })
  id!: number;

  @ApiProperty({
    example: 1,
  })
  planId!: number;

  @ApiProperty({
    enum: PlanGrantType,
    example: PlanGrantType.Limit,
  })
  type!: PlanGrantType;

  @ApiProperty({
    example: '권한 설명',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    example: PlanGrantConstraintsTypeList.join('\n'),
    nullable: true,
  })
  constraints!: string | null;

  @ApiProperty({
    example: 10,
    nullable: true,
  })
  amount!: number | null;

  @ApiProperty({
    example: false,
  })
  isRenewable!: boolean;

  @ApiProperty({
    example: true,
  })
  isAllowed!: boolean;
}
