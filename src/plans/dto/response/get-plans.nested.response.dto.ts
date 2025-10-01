import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { PlanNameType } from '@share/enums/plan-name-type.enum';

export class PlanDiscountNestedResponseDto {
  @ApiProperty({ description: '플랜 할인 ID', example: 1, default: 1 })
  id: number = 1;

  @ApiPropertyNullable({ description: '플랜 할인 이름', example: '기본 무료 플랜', nullable: true, default: '기본 무료 플랜' })
  name: string | null = '기본 무료 플랜';

  @ApiPropertyNullable({ description: '플랜 할인 유형', example: '기본 무료 플랜', nullable: true, default: '기본 무료 플랜' })
  type: string | null = '기본 무료 플랜';

  @ApiPropertyNullable({ description: '플랜 할인 금액', example: 0, nullable: true, default: 2000 })
  discountAmount: number | null = 2000;

  @ApiPropertyNullable({ description: '플랜 할인 퍼센트', example: 0, nullable: true, default: 10 })
  discountPercentage: number | null = 10;
}

export class GetPlansNestedResponseDto {
  @ApiProperty({ description: '플랜 ID', example: 1, default: 1 })
  id: number = 1;

  @ApiProperty({ description: '플랜 이름', example: PlanNameType.Free, enum: PlanNameType, default: PlanNameType.Free })
  name: PlanNameType = PlanNameType.Free;

  @ApiProperty({ description: '플랜 설명', example: '기본 무료 플랜', nullable: true, default: '기본 무료 플랜' })
  description: string | null = '기본 무료 플랜';

  @ApiProperty({ description: '플랜 가격', example: 0, default: 0 })
  price: number = 0;

  @ApiProperty({ description: '플랜 기간', example: 'monthly', default: 'monthly' })
  period: string = 'monthly';

  @ApiProperty({ description: '플랜 기능 목록', example: ['기능1', '기능2'], isArray: true, default: ['기능1', '기능2'] })
  features: string[] = ['기능1', '기능2'];

  @ApiProperty({
    description: '플랜 할인 목록',
    type: () => PlanDiscountNestedResponseDto,
    isArray: true,
    example: [new PlanDiscountNestedResponseDto()],
  })
  planDiscounts: PlanDiscountNestedResponseDto[] = [new PlanDiscountNestedResponseDto()];

  @ApiProperty({ description: '버튼 텍스트', example: '무료로 시작하기', default: '무료로 시작하기' })
  buttonText: string = '무료로 시작하기';
}
