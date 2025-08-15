import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(Payment).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<Payment>): Promise<boolean> {
    return this.orm.getRepo(Payment).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<Payment>): Promise<boolean> {
    return this.orm.getRepo(Payment).exists({ where: condition });
  }
}
