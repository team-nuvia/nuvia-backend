import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePlanDiscountDto } from './dto/create-plan-discount.dto';
import { UpdatePlanDiscountDto } from './dto/update-plan-discount.dto';
import { PlanDiscountsService } from './plan-discounts.service';

@RequiredLogin
@ApiTags('플랜 할인')
@Controller(':planId/plan-discounts')
export class PlanDiscountsController {
  constructor(private readonly planDiscountsService: PlanDiscountsService) {}

  @ApiOperation({ summary: '플랜 할인 생성' })
  @Post()
  create(@Body() createPlanDiscountDto: CreatePlanDiscountDto, @Param('planId') planId: string) {
    return this.planDiscountsService.create(+planId, createPlanDiscountDto);
  }

  @ApiOperation({ summary: '플랜 할인 수정' })
  @Patch(':planDiscountId')
  update(@Param('planDiscountId') planDiscountId: string, @Body() updatePlanDiscountDto: UpdatePlanDiscountDto, @Param('planId') planId: string) {
    return this.planDiscountsService.update(+planId, +planDiscountId, updatePlanDiscountDto);
  }

  @ApiOperation({ summary: '플랜 할인 삭제' })
  @Delete(':planDiscountId')
  remove(@Param('planDiscountId') planDiscountId: string, @Param('planId') planId: string) {
    return this.planDiscountsService.remove(+planId, +planDiscountId);
  }
}
