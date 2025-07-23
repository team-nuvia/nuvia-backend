import { ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async transactional(callback: (repository: Repository<T>) => Promise<T>): Promise<T> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const result = await callback(this.repository);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
