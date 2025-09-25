import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { AccessSearchQueryParamDto } from './dto/param/access-search-query.param.dto';
import { GetAllUserAccesseListPaginatedResponseDto } from './dto/response/get-all-user-accesse-list.response.dto';
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

  async findAll(userId: number, searchQuery: AccessSearchQueryParamDto): Promise<GetAllUserAccesseListPaginatedResponseDto> {
    const { search, page, limit } = searchQuery;

    const query = this.orm
      .getRepo(UserAccess)
      .createQueryBuilder('ua')
      .leftJoinAndSelect('ua.user', 'u')
      .leftJoinAndSelect('u.userProvider', 'up')
      .where('u.id = :userId', { userId });

    if (search) {
      query.andWhere('ua.accessIp LIKE :search', { search: `%${search}%` });
    }

    const [userAccessList, total] = await query
      .orderBy('ua.lastAccessAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const composedUserAccessList = userAccessList.map<GetUserAccessNestedDto>((userAccess) => ({
      id: userAccess.id,
      accessIp: userAccess.accessIp,
      accessDevice: userAccess.accessDevice,
      accessBrowser: userAccess.accessBrowser,
      accessUserAgent: userAccess.accessUserAgent,
      lastAccessAt: userAccess.lastAccessAt,
      user: {
        id: userAccess.user.id,
        name: userAccess.user.userProvider.name,
        email: userAccess.user.userProvider.email,
        nickname: userAccess.user.userProvider.nickname,
      },
    }));

    return {
      page,
      limit,
      total,
      data: composedUserAccessList,
    };
  }

  async findByUserId(userId: number): Promise<GetUserAccessNestedDto[]> {
    const userAccessList = await this.orm
      .getRepo(UserAccess)
      .createQueryBuilder('ua')
      .leftJoinAndSelect('ua.user', 'u')
      .leftJoinAndSelect('u.userProvider', 'up')
      .where('ua.userId = :userId', { userId })
      .getMany();

    return userAccessList.map<GetUserAccessNestedDto>((userAccess) => ({
      id: userAccess.id,
      accessIp: userAccess.accessIp,
      accessDevice: userAccess.accessDevice,
      accessBrowser: userAccess.accessBrowser,
      accessUserAgent: userAccess.accessUserAgent,
      lastAccessAt: userAccess.lastAccessAt,
      user: {
        id: userAccess.user.id,
        name: userAccess.user.userProvider.name,
        email: userAccess.user.userProvider.email,
        nickname: userAccess.user.userProvider.nickname,
      },
    }));
  }
}
