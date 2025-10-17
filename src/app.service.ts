import { SERVER_VERSION } from '@common/variable/environment';
import { Injectable } from '@nestjs/common';
import path from 'path';
import { Worker } from 'worker_threads';

@Injectable()
export class AppService {
  getVersion(): string {
    // const version = [SERVER_VERSION, DEPLOY_VERSION].join('-');
    return `V.${SERVER_VERSION}`;
  }

  /* Test용 */
  getHello(): string {
    const workerData = {
      data: 'hello',
    };
    const worker = new Worker(path.join(__dirname, 'workers', 'node-worker.js'), { workerData });
    worker.on('message', (message) => {
      console.log(`get value from worker: ${message}`);
    });
    worker.on('error', (message) => {
      console.log(`get error from worker: ${message}`);
    });
    worker.on('exit', (exitCode) => {
      console.log('exit worker', exitCode);
    });
    return 'workerData is done!';
  }

  onModuleInit() {
    const version = this.getVersion();
    console.log(`App version: ${version}`);
  }
}
