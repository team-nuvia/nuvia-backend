import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { UserSecret } from '@users/user-secrets/entities/user-secret.entity';
import { BatchesService } from './batches.service';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([User, UserSecret])],
  providers: [BatchesService],
})
export class BatchesModule {}
