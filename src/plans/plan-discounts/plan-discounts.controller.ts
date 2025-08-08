import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePlanDiscountDto } from './dto/create-plan-discount.dto';
import { UpdatePlanDiscountDto } from './dto/update-plan-discount.dto';
import { PlanDiscountsService } from './plan-discounts.service';

@RequiredLogin
@ApiTags('플랜 할인')
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
