import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionGrantsModule } from './permission-grants/permission-grants.module';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  imports: [PermissionGrantsModule],
})
export class PermissionsModule {}
