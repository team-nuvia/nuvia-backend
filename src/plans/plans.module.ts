import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { PlanDiscountsModule } from './plan-discounts/plan-discounts.module';
import { PlanGrantsModule } from './plan-grants/plan-grants.module';

@Module({
  controllers: [PlansController],
  providers: [PlansService],
  imports: [PlanDiscountsModule, PlanGrantsModule],
})
export class PlansModule {}
