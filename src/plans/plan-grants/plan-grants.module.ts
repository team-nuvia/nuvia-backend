import { Module } from '@nestjs/common';
import { PlanGrantsService } from './plan-grants.service';
import { PlanGrantsController } from './plan-grants.controller';

@Module({
  controllers: [PlanGrantsController],
  providers: [PlanGrantsService],
})
export class PlanGrantsModule {}
