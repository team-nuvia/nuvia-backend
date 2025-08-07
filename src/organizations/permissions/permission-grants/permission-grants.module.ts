import { Module } from '@nestjs/common';
import { PermissionGrantsService } from './permission-grants.service';
import { PermissionGrantsController } from './permission-grants.controller';

@Module({
  controllers: [PermissionGrantsController],
  providers: [PermissionGrantsService],
})
export class PermissionGrantsModule {}
