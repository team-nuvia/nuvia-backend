import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { PlanDiscountsModule } from './plan-discounts/plan-discounts.module';
import { PlanGrantsModule } from './plan-grants/plan-grants.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    PlanDiscountsModule,
    PlanGrantsModule,
    RouterModule.register([
      {
        path: 'plans',
        module: PlanDiscountsModule,
      },
      {
        path: 'plans',
        module: PlanGrantsModule,
      },
    ]),
  ],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
