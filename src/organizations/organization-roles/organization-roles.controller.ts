import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UpdateOrganizationRoleDto } from './dto/update-organization-role.dto';
import { OrganizationRolesService } from './organization-roles.service';

@Controller(':organizationId/organization-roles')
export class OrganizationRolesController {
  constructor(private readonly organizationRolesService: OrganizationRolesService) {}

  @Get()
  findAll(@Param('organizationId') organizationId: string) {
    return this.organizationRolesService.findAll(+organizationId);
  }

  @Get(':id')
  findOne(@Param('organizationId') organizationId: string, @Param('id') id: string) {
    return this.organizationRolesService.findOne(+organizationId, +id);
  }

  @Patch(':id')
  update(@Param('organizationId') organizationId: string, @Param('id') id: string, @Body() updateOrganizationRoleDto: UpdateOrganizationRoleDto) {
    return this.organizationRolesService.update(+organizationId, +id, updateOrganizationRoleDto);
  }

  @Delete(':id')
  remove(@Param('organizationId') organizationId: string, @Param('id') id: string) {
    return this.organizationRolesService.remove(+organizationId, +id);
  }
}
