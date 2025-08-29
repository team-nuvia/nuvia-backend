import { ApiProperty } from '@nestjs/swagger';
import { PlanNameType } from '@share/enums/plan-name-type.enum';
import { OrganizationDataPlanGrantNestedResponseDto } from './organization-data-plan-grant.nested.response.dto';

export class OrganizationDataPlanNestedResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number = 1;

  @ApiProperty({
    enum: PlanNameType,
    example: PlanNameType.Basic,
  })
  name: PlanNameType = PlanNameType.Basic;

  @ApiProperty({
    example: '예시 플랜 설명',
    nullable: true,
  })
  description: string | null = '예시 플랜 설명';

  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date = new Date();

  @ApiProperty({
    example: new Date(),
  })
  updatedAt: Date = new Date();

  @ApiProperty({
    type: () => OrganizationDataPlanGrantNestedResponseDto,
    isArray: true,
    example: [new OrganizationDataPlanGrantNestedResponseDto()],
  })
  planGrants: OrganizationDataPlanGrantNestedResponseDto[] = [new OrganizationDataPlanGrantNestedResponseDto()];
}
