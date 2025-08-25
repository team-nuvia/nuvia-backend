import { Permission } from '@/permissions/entities/permission.entity';
import { BaseRepository } from '@common/base.repository';
import { CommonService } from '@common/common.service';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { NotificationType } from '@share/enums/notification-type';
import { User } from '@users/entities/user.entity';
import { OrmHelper } from '@util/orm.helper';
import { UtilService } from '@util/util.service';
import { FindOptionsWhere, In } from 'typeorm';
import { NoInviteSelfExceptionDto } from './dto/exception/no-invite-self.exception.dto';
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

  async addNotifications(subscriptionId: number, type: NotificationType, userId: number, emails: string[]) {
    const fromOrganization = await this.orm.getRepo(Subscription).findOne({ where: { id: subscriptionId } });

    if (!fromOrganization) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    const toUsers = await this.orm.getRepo(User).find({ where: { email: In(emails) }, select: ['id'] });

    await Promise.all(
      toUsers.map((to) =>
        this.addNotification({
          fromId: userId,
          toId: to.id,
          type,
          referenceId: subscriptionId,
          title: '초대 알림',
          content: `${fromOrganization.name} 조직에서 초대 메일을 보냈습니다.`,
        }),
      ),
    );
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

    if (inviteSubscriptionDto.emails.includes(fromUser.email)) {
      throw new NoInviteSelfExceptionDto();
    }

    const subscription = await this.orm
      .getRepo(Subscription)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'u')
      .leftJoinAndMapOne('s.defaultPermission', Permission, 'sp', 'sp.role = s.defaultRole')
      .leftJoinAndSelect('s.organizationRoles', 'or')
      .leftJoinAndSelect('or.user', 'u2')
      .leftJoinAndSelect('s.plan', 'p')
      .leftJoinAndSelect('p.planGrants', 'pg')
      .where('s.id = :id', { id: subscriptionId })
      .getOne();

    if (!subscription) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    const alreadyInvitedUsers = subscription.organizationRoles.filter(
      (role) => inviteSubscriptionDto.emails.includes(role.user.email) && !role.isJoined && role.deletedAt === null,
    );
    /* 이미 초대 됐지만 아직 승락하지 않은 로그 제거 처리 */
    if (alreadyInvitedUsers.length > 0) {
      await this.orm.getRepo(OrganizationRole).update(
        alreadyInvitedUsers.map((role) => role.id),
        {
          isActive: false,
          isJoined: false,
          deletedAt: new Date(),
        },
      );
    }

    const joinedUsers = subscription.organizationRoles.filter((role) => role.isJoined && role.deletedAt === null).map((role) => role.userId);
    const withoutUsers = new Set([...joinedUsers, userId]);

    const users = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .where('u.email IN (:...emails)', { emails: inviteSubscriptionDto.emails })
      .andWhere('u.id NOT IN (:...ids)', { ids: [...withoutUsers] })
      .getMany();
    const toUsers = users.map((user) => user.email);

    const organizationRoles = users.map<Partial<OrganizationRole>>((user) => ({
      subscriptionId,
      userId: user.id,
      permissionId: (subscription as Subscription & { defaultPermission: Permission }).defaultPermission.id,
      isJoined: false,
      isActive: false,
    }));

    if (toUsers.length > 0) {
      console.log('🚀 ~ SubscriptionsRepository ~ inviteUsers ~ toUsers:', toUsers);
      await this.orm.getRepo(OrganizationRole).insert(organizationRoles);

      await Promise.all(
        toUsers.map((toUser) => {
          const token = this.utilService.createInvitationToken(subscriptionId, toUser, userId);
          const invitationVerificationLink = `${this.commonService.getConfig('common').clientUrl}/invitation?q=${token}`;

          return invitationEmailCallback(toUser, fromUser, subscription, invitationVerificationLink);
        }),
      );
    }
  }
}
