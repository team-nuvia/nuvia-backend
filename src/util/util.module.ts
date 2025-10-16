import { Global, Module } from '@nestjs/common';
import { ProcessingService } from './processing.service';
import { UtilRepository } from './util.repository';
import { UtilService } from './util.service';

@Global()
@Module({
  providers: [ProcessingService, UtilService, UtilRepository],
  exports: [ProcessingService, UtilService, UtilRepository],
})
export class UtilModule {}
