import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanDiscountsService } from './plan-discounts.service';
import { CreatePlanDiscountDto } from './dto/create-plan-discount.dto';
import { UpdatePlanDiscountDto } from './dto/update-plan-discount.dto';

@Controller('plan-discounts')
export class PlanDiscountsController {
  constructor(private readonly planDiscountsService: PlanDiscountsService) {}

  @Post()
  create(@Body() createPlanDiscountDto: CreatePlanDiscountDto) {
    return this.planDiscountsService.create(createPlanDiscountDto);
  }

  @Get()
  findAll() {
    return this.planDiscountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planDiscountsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDiscountDto: UpdatePlanDiscountDto) {
    return this.planDiscountsService.update(+id, updatePlanDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planDiscountsService.remove(+id);
  }
}
