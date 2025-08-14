import { OrmHelper } from '@util/orm.helper';
import { DeleteResult, FindOptionsWhere } from 'typeorm';

export abstract class BaseRepository {
  constructor(protected readonly orm: OrmHelper) {}

  abstract existsBy<T>(condition: FindOptionsWhere<T>): Promise<boolean>;

  abstract existsByWithDeleted<T>(condition: FindOptionsWhere<T>): Promise<boolean>;

  abstract softDelete(id: number): Promise<DeleteResult>;
}
