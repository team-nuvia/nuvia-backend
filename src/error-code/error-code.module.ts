import { Module } from '@nestjs/common';
import { ErrorCodeController } from './error-code.controller';
import { ErrorCodeService } from './error-code.service';

@Module({
  controllers: [ErrorCodeController],
  providers: [ErrorCodeService],
})
export class ErrorCodeModule {}
