import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { UserSecret } from '@users/user-secrets/entities/user-secret.entity';
import { BatchesService } from './batches.service';
import { IS_PROD } from '@common/variable/environment';

// pm2 첫번째(마스터, 0번 인스턴스)에서만 배치를 돌리도록 환경 변수를 체크하는 코드 추가
const isBatchesInstance = IS_PROD ? process.env.NODE_APP_INSTANCE === '0' : true;
const providers = isBatchesInstance ? [BatchesService] : [];

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([User, UserSecret])],
  providers,
})
export class BatchesModule {}
