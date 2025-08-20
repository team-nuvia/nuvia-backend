import { Permission } from '@/permissions/entities/permission.entity';
import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { NotFoundSubscriptionExceptionDto } from './dto/exception/not-found-subscription.exception.dto';
import { InviteSubscriptionPayloadDto } from './dto/payload/invite-subscription.payload.dto';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(Subscription).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<Subscription>): Promise<boolean> {
    return this.orm.getRepo(Subscription).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<Subscription>): Promise<boolean> {
    return this.orm.getRepo(Subscription).exists({ where: condition });
  }

  async inviteUsers(subscriptionId: number, inviteSubscriptionDto: InviteSubscriptionPayloadDto) {
    const subscription = await this.orm
      .getRepo(Subscription)
      .createQueryBuilder('s')
      .leftJoinAndMapOne('s.defaultRole', Permission, 'sp', 'sp.role = s.defaultRole')
      .where('s.id = :id', { id: subscriptionId })
      .getOne();

    if (!subscription) {
      throw new NotFoundSubscriptionExceptionDto('Subscription not found');
    }

    const organizationRoles = inviteSubscriptionDto.emails.map((email) => ({
      subscriptionId,
      userId: email,
      permissionId: subscription.defaultRole,
    }));

    // return this.orm.getRepo(Subscription).update(subscriptionId, inviteSubscriptionDto);
  }
}
