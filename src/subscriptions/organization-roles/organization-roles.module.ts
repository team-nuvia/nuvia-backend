import { Module } from '@nestjs/common';
import { OrganizationRolesController } from './organization-roles.controller';
import { OrganizationRolesRepository } from './organization-roles.repository';
import { OrganizationRolesService } from './organization-roles.service';

@Module({
  controllers: [OrganizationRolesController],
  providers: [OrganizationRolesService, OrganizationRolesRepository],
  exports: [OrganizationRolesService],
})
export class OrganizationRolesModule {}
