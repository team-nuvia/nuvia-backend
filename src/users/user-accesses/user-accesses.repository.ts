import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { GetUserAccessNestedDto } from './dto/response/get-user-access.nested.dto';
import { UserAccess } from './entities/user-access.entity';

@Injectable()
export class UserAccessRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(UserAccess).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<UserAccess>): Promise<boolean> {
    return this.orm.getRepo(UserAccess).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<UserAccess>): Promise<boolean> {
    return this.orm.getRepo(UserAccess).exists({ where: condition });
  }

  async findAll(): Promise<GetUserAccessNestedDto[]> {
    const userAccessList = await this.orm.getRepo(UserAccess).find({
      relations: ['user'],
    });

    return userAccessList.map<GetUserAccessNestedDto>((userAccess) => ({
      id: userAccess.id,
      accessIp: userAccess.accessIp,
      accessDevice: userAccess.accessDevice,
      accessBrowser: userAccess.accessBrowser,
      accessUserAgent: userAccess.accessUserAgent,
      lastAccessAt: userAccess.lastAccessAt,
      user: {
        id: userAccess.user.id,
        name: userAccess.user.name,
        email: userAccess.user.email,
        nickname: userAccess.user.nickname,
      },
    }));
  }

  findByUserId(userId: number): Promise<GetUserAccessNestedDto[]> {
    return this.orm.getRepo(UserAccess).find({ where: { userId } });
  }
}
