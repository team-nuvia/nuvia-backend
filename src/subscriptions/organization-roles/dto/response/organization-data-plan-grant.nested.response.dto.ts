import { PlanGrantConstraintsTypeList } from '@/plans/enums/plan-grant-constraints-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { PlanGrantType } from '@share/enums/plan-grant-type.enum';

export class OrganizationDataPlanGrantNestedResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number = 1;

  @ApiProperty({
    example: 1,
  })
  planId: number = 1;

  @ApiProperty({
    enum: PlanGrantType,
    example: PlanGrantType.Limit,
  })
  type: PlanGrantType = PlanGrantType.Limit;

  @ApiProperty({
    example: '권한 설명',
    nullable: true,
  })
  description: string | null = '권한 설명';

  @ApiProperty({
    example: PlanGrantConstraintsTypeList.join('\n'),
    nullable: true,
  })
  constraints: string | null = '권한 제약 조건';

  @ApiProperty({
    example: 10,
    nullable: true,
  })
  amount: number | null = 10;

  @ApiProperty({
    example: false,
  })
  isRenewable: boolean = false;

  @ApiProperty({
    example: true,
  })
  isAllowed: boolean = true;
}
