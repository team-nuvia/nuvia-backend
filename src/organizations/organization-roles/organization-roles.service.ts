import { Injectable } from '@nestjs/common';
import { UpdateOrganizationRoleDto } from './dto/update-organization-role.dto';
import { OrganizationRole } from './entities/organization-role.entity';
import { OrganizationRolesRepository } from './organization-roles.repository';

@Injectable()
export class OrganizationRolesService {
  constructor(private readonly organizationRolesRepository: OrganizationRolesRepository) {}

  findAll(organizationId: number) {
    return this.organizationRolesRepository.orm
      .getManager()
      .createQueryBuilder(OrganizationRole, 'organizationRole')
      .where('organizationRole.organizationId = :organizationId', { organizationId })
      .getMany();
  }

  findOne(organizationId: number, id: number) {
    return this.organizationRolesRepository.orm
      .getManager()
      .createQueryBuilder(OrganizationRole, 'organizationRole')
      .where('organizationRole.organizationId = :organizationId', { organizationId })
      .andWhere('organizationRole.id = :id', { id })
      .getOne();
  }

  update(organizationId: number, id: number, updateOrganizationRoleDto: UpdateOrganizationRoleDto) {
    return this.organizationRolesRepository.orm
      .getManager()
      .createQueryBuilder(OrganizationRole, 'organizationRole')
      .update()
      .set(updateOrganizationRoleDto)
      .where('organizationRole.organizationId = :organizationId', { organizationId })
      .andWhere('organizationRole.id = :id', { id })
      .execute();
  }

  remove(organizationId: number, id: number) {
    return this.organizationRolesRepository.orm
      .getManager()
      .createQueryBuilder(OrganizationRole, 'organizationRole')
      .softDelete()
      .where('organizationRole.organizationId = :organizationId', { organizationId })
      .andWhere('organizationRole.id = :id', { id })
      .execute();
  }
}
