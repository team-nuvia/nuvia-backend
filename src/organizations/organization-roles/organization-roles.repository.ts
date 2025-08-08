import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';

@Injectable()
export class OrganizationRolesRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
    super(orm);
  }
}
