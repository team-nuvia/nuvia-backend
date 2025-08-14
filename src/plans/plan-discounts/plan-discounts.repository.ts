import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { DeleteResult, FindOptionsWhere } from 'typeorm';
import { PlanDiscount } from './entities/plan-discount.entity';

@Injectable()
export class PlanDiscountsRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
    super(orm);
  }

  softDelete(id: number): Promise<DeleteResult> {
    return this.orm.getRepo(PlanDiscount).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<PlanDiscount>): Promise<boolean> {
    return this.orm.getRepo(PlanDiscount).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<PlanDiscount>): Promise<boolean> {
    return this.orm.getRepo(PlanDiscount).exists({ where: condition });
  }
}
