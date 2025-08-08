import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { UpdateOrganizationDto } from './dto/payload/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsRepository extends BaseRepository {
  constructor(protected readonly orm: OrmHelper) {
    super(orm);
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    await this.orm.getRepo(Organization).update(id, updateOrganizationDto);
  }
}
