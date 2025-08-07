import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  imports: [PermissionsModule],
})
export class OrganizationsModule {}
