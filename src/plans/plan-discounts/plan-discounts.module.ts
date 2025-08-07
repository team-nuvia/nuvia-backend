import { Module } from '@nestjs/common';
import { PlanDiscountsService } from './plan-discounts.service';
import { PlanDiscountsController } from './plan-discounts.controller';

@Module({
  controllers: [PlanDiscountsController],
  providers: [PlanDiscountsService],
})
export class PlanDiscountsModule {}
