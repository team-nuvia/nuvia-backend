import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { PlanDiscountsModule } from './plan-discounts/plan-discounts.module';
import { PlanGrantsModule } from './plan-grants/plan-grants.module';
import { PlansController } from './plans.controller';
import { PlansRepository } from './plans.repository';
import { PlansService } from './plans.service';

@Module({
  imports: [
    PlanDiscountsModule,
    PlanGrantsModule,
    TypeOrmModule.forFeature([Plan]),
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
  providers: [PlansService, PlansRepository],
})
export class PlansModule {}
