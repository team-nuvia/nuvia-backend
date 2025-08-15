import { Global, Module } from '@nestjs/common';
import { UtilRepository } from './util.repository';
import { UtilService } from './util.service';

@Global()
@Module({
  providers: [UtilService, UtilRepository],
  exports: [UtilService, UtilRepository],
})
export class UtilModule {}
