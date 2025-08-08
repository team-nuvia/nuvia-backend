import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

export class TxContext {
  private readonly als = new AsyncLocalStorage<EntityManager | null>();

  runWithManager<T>(em: EntityManager, fn: () => Promise<T>): Promise<T> {
    return this.als.run(em, fn);
  }

  get currentManager(): EntityManager | null {
    return this.als.getStore() ?? null;
  }
}
