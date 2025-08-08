import { Module } from '@nestjs/common';
import { PlanDiscountsController } from './plan-discounts.controller';
import { PlanDiscountsRepository } from './plan-discounts.repository';
import { PlanDiscountsService } from './plan-discounts.service';

@Module({
  controllers: [PlanDiscountsController],
  providers: [PlanDiscountsService, PlanDiscountsRepository],
})
export class PlanDiscountsModule {}
