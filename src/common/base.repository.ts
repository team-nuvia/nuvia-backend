import { EntityManager, ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  get owner() {
    return this.repository;
  }

  useManager(manager?: EntityManager): {
    owner: Repository<T>;
    manager: Repository<T>;
  } {
    const owner = manager ? manager.getRepository(this.owner.target) : this.owner.manager.getRepository(this.owner.target);

    return {
      owner: this.owner,
      manager: owner as Repository<T>,
    };
  }

  // async transactional(callback: (repository: Repository<T>) => Promise<T>): Promise<T> {
  //   const queryRunner = this.repository.manager.connection.createQueryRunner();
  //   queryRunner.startTransaction();
  //   try {
  //     const result = await callback(this.repository);
  //     await queryRunner.commitTransaction();
  //     return result;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
