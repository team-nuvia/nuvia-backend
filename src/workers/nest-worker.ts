import { AppModule } from '@/app.module';
import { CommonService } from '@common/common.service';
import { NestFactory } from '@nestjs/core';
import { parentPort, workerData } from 'worker_threads';

async function nestWorker() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const commonService = app.get(CommonService);
  const { data } = workerData;
  parentPort?.postMessage(commonService.getConfig(data));
}

nestWorker();
