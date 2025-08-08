import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { DeleteResult } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesRepository extends BaseRepository {
  constructor(protected readonly orm: OrmHelper) {
    super(orm);
  }

  async findByUserId(userId: number) {
    return this.orm.getRepo(Profile).findOne({ where: { userId } });
  }

  async uploadProfileImage(userId: number, profile: Partial<Omit<Profile, 'userId'>>) {
    return this.orm.getRepo(Profile).save({ userId, ...profile });
  }

  update(userId: number, profile: Partial<Omit<Profile, 'userId'>>) {
    return this.orm.getRepo(Profile).update(userId, profile);
  }

  delete(userId: number): Promise<DeleteResult> {
    return this.orm.getRepo(Profile).delete(userId);
  }
}
