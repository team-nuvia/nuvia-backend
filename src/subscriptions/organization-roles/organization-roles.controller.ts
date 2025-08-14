import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOrganizationRoleDto } from './dto/payload/update-organization-role.dto';
import { OrganizationRolesService } from './organization-roles.service';

@RequiredLogin
@ApiTags('조직 역할')
@Controller(':subscriptionId/organization-roles')
export class OrganizationRolesController {
  constructor(private readonly organizationRolesService: OrganizationRolesService) {}

  @Get()
  findAll(@Param('subscriptionId') subscriptionId: string) {
    return this.organizationRolesService.findAll(+subscriptionId);
  }

  @Get(':id')
  findOne(@Param('subscriptionId') subscriptionId: string, @Param('id') id: string) {
    return this.organizationRolesService.findOne(+subscriptionId, +id);
  }

  @Patch(':id')
  update(@Param('subscriptionId') subscriptionId: string, @Param('id') id: string, @Body() updateOrganizationRoleDto: UpdateOrganizationRoleDto) {
    return this.organizationRolesService.update(+subscriptionId, +id, updateOrganizationRoleDto);
  }

  @Delete(':id')
  remove(@Param('subscriptionId') subscriptionId: string, @Param('id') id: string) {
    return this.organizationRolesService.remove(+subscriptionId, +id);
  }
}
