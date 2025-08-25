import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchesService } from './batches.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [BatchesService],
})
export class BatchesModule {}
