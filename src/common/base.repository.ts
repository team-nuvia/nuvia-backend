import { OrmHelper } from '@util/orm.helper';

export abstract class BaseRepository {
  constructor(protected readonly orm: OrmHelper) {}
}
