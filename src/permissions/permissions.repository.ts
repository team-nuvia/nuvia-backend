import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { DeleteResult, FindOptionsWhere } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
    super(orm);
  }

  softDelete(id: number): Promise<DeleteResult> {
    return this.orm.getRepo(Permission).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<Permission>): Promise<boolean> {
    return this.orm.getRepo(Permission).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<Permission>): Promise<boolean> {
    return this.orm.getRepo(Permission).exists({ where: condition });
  }
}
