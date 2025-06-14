import { Module } from '@nestjs/common';
import { ErrorCodeService } from './error-code.service';
import { ErrorCodeController } from './error-code.controller';

@Module({
  controllers: [ErrorCodeController],
  providers: [ErrorCodeService],
})
export class ErrorCodeModule {}
