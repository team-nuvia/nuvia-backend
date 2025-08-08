import { DEPLOY_VERSION, SERVER_VERSION } from '@common/variable/environment';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@users/users.repository';
import path from 'path';
import { Worker } from 'worker_threads';

@Injectable()
export class AppService {
  constructor(private readonly userRepository: UsersRepository) {}

  async transactionTest() {
    await this.saveUser();
    await this.saveTestTable();
    throw new Error('test');
  }

  async saveUser() {
    await this.userRepository.orm
      .getManager()
      .createQueryBuilder()
      .insert()
      .into('user')
      .values({
        email: 'test2@test.com',
        name: 'test2',
        nickname: 'test2 nickname',
      })
      .execute();
  }

  async saveTestTable() {
    await this.userRepository.orm.getManager().createQueryBuilder().insert().into('test_tbl').values({ name: 'test3', age: 33 }).execute();
  }

  getVersion(): string {
    const version = [SERVER_VERSION, DEPLOY_VERSION].join('.');
    return `V${version}`;
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
