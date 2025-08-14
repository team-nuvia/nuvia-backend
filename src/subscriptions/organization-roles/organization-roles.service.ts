import { Injectable } from '@nestjs/common';
import { UpdateOrganizationRoleDto } from './dto/update-organization-role.dto';
import { OrganizationRole } from './entities/organization-role.entity';
import { OrganizationRolesRepository } from './organization-roles.repository';

@Injectable()
export class OrganizationRolesService {
  constructor(private readonly organizationRolesRepository: OrganizationRolesRepository) {}

  findAll(subscriptionId: number) {
    return this.organizationRolesRepository.orm
      .getManager()
      .createQueryBuilder(OrganizationRole, 'organizationRole')
      .where('organizationRole.subscriptionId = :subscriptionId', { subscriptionId })
      .getMany();
  }

  findOne(subscriptionId: number, id: number) {
    return this.organizationRolesRepository.orm
      .getManager()
      .createQueryBuilder(OrganizationRole, 'organizationRole')
      .where('organizationRole.subscriptionId = :subscriptionId', { subscriptionId })
      .andWhere('organizationRole.id = :id', { id })
      .getOne();
  }

  update(subscriptionId: number, id: number, updateOrganizationRoleDto: UpdateOrganizationRoleDto) {
    return this.organizationRolesRepository.orm
      .getManager()
      .createQueryBuilder(OrganizationRole, 'organizationRole')
      .update()
      .set(updateOrganizationRoleDto)
      .where('organizationRole.subscriptionId = :subscriptionId', { subscriptionId })
      .andWhere('organizationRole.id = :id', { id })
      .execute();
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
