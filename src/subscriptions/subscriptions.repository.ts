import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(Subscription).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<Subscription>): Promise<boolean> {
    return this.orm.getRepo(Subscription).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<Subscription>): Promise<boolean> {
    return this.orm.getRepo(Subscription).exists({ where: condition });
  }
}
