import { DEPLOY_VERSION, SERVER_VERSION } from '@common/variable/environment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getVersion(): string {
    const version = [SERVER_VERSION, DEPLOY_VERSION].join('.');
    return `V${version}`;
  }
}
