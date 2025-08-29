import { Injectable } from '@nestjs/common';
import { UpdateOrganizationRolePayloadDto } from './dto/payload/update-organization-role.payload.dto';
import { TableOrganizationRoleNestedResponseDto } from './dto/response/table-organization-role.nested.response.dto';
import { OrganizationRole } from './entities/organization-role.entity';
import { OrganizationRolesRepository } from './organization-roles.repository';

@Injectable()
export class OrganizationRolesService {
  constructor(private readonly organizationRolesRepository: OrganizationRolesRepository) {}

  findAll(subscriptionId: number): Promise<TableOrganizationRoleNestedResponseDto[]> {
    return this.organizationRolesRepository.findAll(subscriptionId);
  }

  findOne(subscriptionId: number, id: number) {
    return this.organizationRolesRepository.orm
      .getManager()
      .createQueryBuilder(OrganizationRole, 'organizationRole')
      .where('organizationRole.subscriptionId = :subscriptionId', { subscriptionId })
      .andWhere('organizationRole.id = :id', { id })
      .getOne();
  }

  update(subscriptionId: number, organizationRoleId: number, userId: number, updateOrganizationRolePayloadDto: UpdateOrganizationRolePayloadDto) {
    return this.organizationRolesRepository.update(subscriptionId, organizationRoleId, userId, updateOrganizationRolePayloadDto);
  }

  remove(subscriptionId: number, id: number) {
    return this.organizationRolesRepository.orm
      .getManager()
      .createQueryBuilder(OrganizationRole, 'organizationRole')
      .softDelete()
      .where('organizationRole.subscriptionId = :subscriptionId', { subscriptionId })
      .andWhere('organizationRole.id = :id', { id })
      .execute();
  }
}
