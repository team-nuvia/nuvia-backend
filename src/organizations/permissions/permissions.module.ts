import { Module } from '@nestjs/common';
import { PermissionGrantsModule } from './permission-grants/permission-grants.module';
import { PermissionsController } from './permissions.controller';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [PermissionGrantsModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}
