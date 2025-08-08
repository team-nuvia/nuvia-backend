import { TxContext } from '@/database/tx.context';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class OrmHelper {
  constructor(
    private readonly ds: DataSource,
    private readonly ctx: TxContext,
  ) {}

  getManager(): EntityManager {
    return this.ctx.currentManager ?? this.ds.manager;
  }

  getRepo<E extends ObjectLiteral>(entity: { new (): E } | string): Repository<E> {
    return this.getManager().getRepository<E>(entity);
  }
}
