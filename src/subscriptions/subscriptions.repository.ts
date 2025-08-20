import { Permission } from '@/permissions/entities/permission.entity';
import { BaseRepository } from '@common/base.repository';
import { CommonService } from '@common/common.service';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { User } from '@users/entities/user.entity';
import { OrmHelper } from '@util/orm.helper';
import { UtilService } from '@util/util.service';
import { FindOptionsWhere } from 'typeorm';
import { NotFoundSubscriptionExceptionDto } from './dto/exception/not-found-subscription.exception.dto';
import { InviteSubscriptionPayloadDto } from './dto/payload/invite-subscription.payload.dto';
import { Subscription } from './entities/subscription.entity';
import { OrganizationRole } from './organization-roles/entities/organization-role.entity';

@Injectable()
export class SubscriptionsRepository extends BaseRepository {
  constructor(
    readonly orm: OrmHelper,
    private readonly utilService: UtilService,
    private readonly commonService: CommonService,
  ) {
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

  async inviteUsers(
    subscriptionId: number,
    inviteSubscriptionDto: InviteSubscriptionPayloadDto,
    userId: number,
    invitationEmailCallback: (toUser: string, fromUser: User, subscription: Subscription, invitationVerificationLink: string) => Promise<void>,
  ) {
    const fromUser = await this.orm.getRepo(User).findOne({ where: { id: userId } });

    if (!fromUser) {
      throw new NotFoundUserExceptionDto();
    }

    const subscription = await this.orm
      .getRepo(Subscription)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'u')
      .leftJoinAndMapOne('s.defaultPermission', Permission, 'sp', 'sp.role = s.defaultRole')
      .leftJoinAndSelect('s.organizationRoles', 'or', 'or.isJoined = 1 AND or.isActive = 1')
      .where('s.id = :id', { id: subscriptionId })
      .getOne();

    const joinedUsers = subscription?.organizationRoles.map((role) => role.userId) ?? [];
    const withoutUsers = new Set([...joinedUsers, userId]);

    const users = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .where('u.email IN (:...emails)', { emails: inviteSubscriptionDto.emails })
      .andWhere('u.id NOT IN (:...ids)', { ids: [...withoutUsers] })
      .getMany();
    const toUsers = users.map((user) => user.email);

    if (!subscription) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    const organizationRoles = users.map<Partial<OrganizationRole>>((user) => ({
      subscriptionId,
      userId: user.id,
      permissionId: (subscription as Subscription & { defaultPermission: Permission }).defaultPermission.id,
      isJoined: false,
      isActive: false,
    }));

    await this.orm.getRepo(OrganizationRole).insert(organizationRoles);

    if (toUsers.length > 0) {
      await Promise.all(
        toUsers.map((toUser) => {
          const token = this.utilService.encodeToken(`${userId}:${subscriptionId}:${toUser}`);
          const invitationVerificationLink = `${this.commonService.getConfig('common').clientUrl}/invitation?q=${token}`;

          return invitationEmailCallback(toUser, fromUser, subscription, invitationVerificationLink);
        }),
      );
    }
  }
}
