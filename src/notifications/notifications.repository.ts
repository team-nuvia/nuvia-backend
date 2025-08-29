import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { NotificationSearchParamDto } from './dto/param/notification-search.param.dto';
import { CreateNotificationPayloadDto } from './dto/payload/create-notification.payload.dto';
import { GetNotificationPaginatedNestedResponseDto } from './dto/response/get-notification-paginated.nested.response.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsRepository extends BaseRepository {
  constructor(ormHelper: OrmHelper) {
    super(ormHelper);
  }

  async existsBy<T extends ObjectLiteral>(condition: FindOptionsWhere<T>, Model?: new () => T): Promise<boolean> {
    if (Model) return this.orm.getRepo(Model).exists({ where: condition });
    return false;
  }

  async existsByWithDeleted<T extends ObjectLiteral>(condition: FindOptionsWhere<T>, Model?: new () => T): Promise<boolean> {
    if (Model) return this.orm.getRepo(Model).exists({ where: condition, withDeleted: true });
    return false;
  }

  async softDelete<T extends ObjectLiteral>(id: number, Model?: new () => T): Promise<void> {
    if (Model) await this.orm.getRepo(Model).softDelete(id);
  }

  async findAll(toId: number, searchQuery: NotificationSearchParamDto): Promise<GetNotificationPaginatedNestedResponseDto> {
    const query = this.orm.getRepo(Notification).createQueryBuilder('n').where('n.toId = :toId', { toId });

    if (searchQuery.search) {
      query.andWhere('n.title LIKE :search', { search: `%${searchQuery.search}%` });
    }

    const [notifications, total] = await query
      .skip((searchQuery.page - 1) * searchQuery.limit)
      .take(searchQuery.limit)
      .getManyAndCount();

    return {
      page: searchQuery.page,
      limit: searchQuery.limit,
      total,
      data: notifications,
    };
  }

  async createNotification(fromId: number, createNotificationDto: CreateNotificationPayloadDto) {
    return this.orm.getRepo(Notification).save({ fromId, ...createNotificationDto });
  }
}
