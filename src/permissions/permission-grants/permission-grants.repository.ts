import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { PermissionGrant } from './entities/permission-grant.entity';

@Injectable()
export class PermissionGrantsRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(PermissionGrant).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<PermissionGrant>): Promise<boolean> {
    return this.orm.getRepo(PermissionGrant).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<PermissionGrant>): Promise<boolean> {
    return this.orm.getRepo(PermissionGrant).exists({ where: condition });
  }
}
