import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { TxContext } from './tx.context';

@Injectable()
export class TxRunner {
  constructor(
    private readonly ds: DataSource,
    private readonly ctx: TxContext,
  ) {}

  async run<T>(work: () => Promise<T>, isolation: IsolationLevel = 'READ COMMITTED'): Promise<T> {
    return this.ds.transaction(isolation, async (em: EntityManager) => {
      console.log('트랜젝션 시작!');
      return this.ctx.runWithManager(em, work);
    });
  }
}
