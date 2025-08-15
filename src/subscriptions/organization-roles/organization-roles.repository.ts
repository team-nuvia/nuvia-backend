import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { OrganizationRole } from './entities/organization-role.entity';

@Injectable()
export class OrganizationRolesRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(OrganizationRole).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<OrganizationRole>): Promise<boolean> {
    return this.orm.getRepo(OrganizationRole).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<OrganizationRole>): Promise<boolean> {
    return this.orm.getRepo(OrganizationRole).exists({ where: condition });
  }
}
