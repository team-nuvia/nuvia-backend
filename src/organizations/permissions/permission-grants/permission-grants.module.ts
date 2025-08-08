import { Module } from '@nestjs/common';
import { PermissionGrantsController } from './permission-grants.controller';
import { PermissionGrantsRepository } from './permission-grants.repository';
import { PermissionGrantsService } from './permission-grants.service';

@Module({
  controllers: [PermissionGrantsController],
  providers: [PermissionGrantsService, PermissionGrantsRepository],
})
export class PermissionGrantsModule {}
