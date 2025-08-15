import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';

@Injectable()
export class UtilRepository extends BaseRepository {
  constructor(orm: OrmHelper) {
    super(orm);
  }

  async softDelete<T extends ObjectLiteral>(id: number, Model?: new () => T): Promise<void> {
    if (Model) await this.orm.getRepo(Model).softDelete(id);
  }

  async existsByWithDeleted<T extends ObjectLiteral>(condition: FindOptionsWhere<T>, Model?: new () => T): Promise<boolean> {
    if (Model) return this.orm.getRepo(Model).exists({ where: condition, withDeleted: true });
    return false;
  }

  async existsBy<T extends ObjectLiteral>(condition: FindOptionsWhere<T>, Model?: new () => T): Promise<boolean> {
    if (Model) return this.orm.getRepo(Model).exists({ where: condition });
    return false;
  }
}
