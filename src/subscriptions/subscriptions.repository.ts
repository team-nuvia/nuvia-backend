import { FailedToAddNotificationExceptionDto } from '@/notifications/dto/exception/filed-to-add-notification.exception.dto';
import { Permission } from '@/permissions/entities/permission.entity';
import { BaseRepository } from '@common/base.repository';
import { CommonService } from '@common/common.service';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { NotificationActionStatus } from '@share/enums/notification-action-status';
import { NotificationType } from '@share/enums/notification-type';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { UserRole } from '@share/enums/user-role';
import { User } from '@users/entities/user.entity';
import { OrmHelper } from '@util/orm.helper';
import { UtilService } from '@util/util.service';
import { FindOptionsWhere, In } from 'typeorm';
import { AlreadyJoinedUserExceptionDto } from './dto/exception/already-joined-user.exception.dto';
import { NoInviteSelfExceptionDto } from './dto/exception/no-invite-self.exception.dto';
import { NoSignedUserExceptionDto } from './dto/exception/no-signed-user.exception.dto';
import { NotFoundSubscriptionExceptionDto } from './dto/exception/not-found-subscription.exception.dto';
import { InviteSubscriptionPayloadDto } from './dto/payload/invite-subscription.payload.dto';
import { UpdateInvitationWithNotificationPayloadDto } from './dto/payload/update-invitation-with-notification.payload.dto';
import { UpdateSubscriptionSettingsPayloadDto } from './dto/payload/update-subscription-settings.payload.dto';
import { GetSubscriptionSettingsNestedResponseDto } from './dto/response/get-subscription-settings.nested.response.dto';
import { Subscription } from './entities/subscription.entity';
import { CannotSetDefaultRoleAsOwnerExceptionDto } from './organization-roles/dto/exception/cannot-set-default-role-as-owner.exception.dto';
import { NotFoundOrganizationRoleExceptionDto } from './organization-roles/dto/exception/not-found-organization-role.exception.dto';
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

  async getSubscriptionSettings(subscriptionId: number, userId: number): Promise<GetSubscriptionSettingsNestedResponseDto> {
    const subscription = await this.orm
      .getRepo(Subscription)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.organizationRoles', 'or')
      .where('s.id = :subscriptionId', { subscriptionId })
      .getOne();

    if (!subscription) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    const organizationRole = subscription.organizationRoles.find((role) => role.userId === userId);

    if (!organizationRole) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    return {
      teamName: subscription.name,
      teamDescription: subscription.description ?? null,
      teamDefaultRole: subscription.defaultRole,
      responseFormat: subscription.responseFormat,
      teamTarget: subscription.target,
    };
  }

  async updateSubscriptionSettings(
    subscriptionId: number,
    userId: number,
    updateSubscriptionSettingsDto: UpdateSubscriptionSettingsPayloadDto,
  ): Promise<void> {
    /* 소유자 권한 지정 방지 */
    if (updateSubscriptionSettingsDto.teamDefaultRole === UserRole.Owner) {
      throw new CannotSetDefaultRoleAsOwnerExceptionDto();
    }

    const subscription = await this.orm
      .getRepo(Subscription)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.organizationRoles', 'or')
      .leftJoinAndSelect('or.user', 'oru')
      .leftJoinAndSelect('or.permission', 'p')
      .where('s.id = :subscriptionId', { subscriptionId })
      .getOne();

    if (!subscription) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    /* 데이터 동일하면 변경 없음 */
    if (
      subscription.name === updateSubscriptionSettingsDto.teamName &&
      updateSubscriptionSettingsDto.teamDescription !== undefined &&
      subscription.description === updateSubscriptionSettingsDto.teamDescription
    ) {
      return;
    }

    if (updateSubscriptionSettingsDto.teamDefaultRole && subscription.defaultRole === updateSubscriptionSettingsDto.teamDefaultRole) {
      return;
    }

    if (updateSubscriptionSettingsDto.responseFormat && subscription.responseFormat === updateSubscriptionSettingsDto.responseFormat) {
      return;
    }

    const organizationRole = subscription.organizationRoles.find((role) => role.userId === userId);

    /* 수정 시도 유저 조직 내 권한 존재 여부 검증 */
    if (!organizationRole) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    const editorUser = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userProviders', 'up')
      .where('u.id = :userId', { userId })
      .getOne();

    if (!editorUser) {
      throw new NotFoundUserExceptionDto();
    }

    await this.orm.getRepo(Subscription).update(subscriptionId, {
      name: updateSubscriptionSettingsDto.teamName,
      description: updateSubscriptionSettingsDto.teamDescription ?? null,
      defaultRole: updateSubscriptionSettingsDto.teamDefaultRole,
      responseFormat: updateSubscriptionSettingsDto.responseFormat,
    });

    /* 조직 설정 변경 알림 추가 */
    await this.addBroadcastNotification({
      fromId: userId,
      toSubscriptionId: subscriptionId,
      type: NotificationType.Information,
      referenceId: subscriptionId,
      title: '조직 설정 변경 알림',
      content: `${editorUser.userProvider.name}(${organizationRole?.permission.role ?? '알수없음'})님이 ${subscription.name} 조직의 설정을 변경하였습니다.`,
    });
  }

  async addInviteNotifications({
    subscriptionId,
    type,
    userId,
    emails,
  }: {
    subscriptionId: number;
    type: NotificationType;
    userId: number;
    emails: string[];
  }) {
    const fromOrganization = await this.orm.getRepo(Subscription).findOne({ where: { id: subscriptionId } });

    if (!fromOrganization) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    try {
      const toUsers = await this.orm.getRepo(User).find({ where: { userProviders: { email: In(emails) } }, select: ['id'] });

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
    } catch (error) {
      console.log('🚀 ~ SubscriptionsRepository ~ addInviteNotifications ~ error:', error);
      throw new FailedToAddNotificationExceptionDto();
    }
  }

  async inviteUsers(
    subscriptionId: number,
    inviteSubscriptionDto: InviteSubscriptionPayloadDto,
    userId: number,
    invitationEmailCallback: (toUser: string, fromUser: User, subscription: Subscription, invitationVerificationLink: string) => Promise<void>,
  ): Promise<void> {
    const fromUser = await this.orm.getRepo(User).findOne({ where: { id: userId }, relations: ['userProviders'] });

    if (!fromUser) {
      throw new NotFoundUserExceptionDto();
    }

    if (inviteSubscriptionDto.emails.includes(fromUser.userProvider.email)) {
      throw new NoInviteSelfExceptionDto();
    }

    const subscription = await this.orm
      .getRepo(Subscription)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'u')
      .leftJoinAndSelect('u.userProviders', 'up')
      .leftJoinAndMapOne('s.defaultPermission', Permission, 'sp', 'sp.role = s.defaultRole')
      .leftJoinAndSelect('s.organizationRoles', 'or')
      .leftJoinAndSelect('or.user', 'oru')
      .leftJoinAndSelect('oru.userProviders', 'up2')
      .leftJoinAndSelect('s.plan', 'p')
      .leftJoinAndSelect('p.planGrants', 'pg')
      .where('s.id = :id', { id: subscriptionId })
      .getOne();

    if (!subscription) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    /* 초대 예정자 중 이미 초대된 리스트 */
    const alreadyInvitedUsers = subscription.organizationRoles.filter(
      (role) => inviteSubscriptionDto.emails.includes(role.user.userProvider.email) && role.status === OrganizationRoleStatusType.Invited,
    );

    /* 이미 초대 됐지만 아직 승락하지 않은 사용자 제거 */
    if (alreadyInvitedUsers.length > 0) {
      await this.orm.getRepo(OrganizationRole).update(
        alreadyInvitedUsers.map((role) => role.id),
        {
          status: OrganizationRoleStatusType.Deleted,
          deletedAt: new Date(),
        },
      );
    }

    const joinedUsers = subscription.organizationRoles.filter((role) => role.status === OrganizationRoleStatusType.Joined);

    const alreadyJoinedUsers = joinedUsers.filter((role) => inviteSubscriptionDto.emails.includes(role.user.userProvider.email));
    if (alreadyJoinedUsers.length > 0) {
      throw new AlreadyJoinedUserExceptionDto(alreadyJoinedUsers.map((role) => role.user.userProvider.email));
    }

    const joinedUserIds = joinedUsers.map((role) => role.userId);
    const removedDuplicateUserIds = new Set([...joinedUserIds, userId]);

    const willInviteUsers = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userProviders', 'up')
      .where('up.email IN (:...emails)', { emails: inviteSubscriptionDto.emails })
      .andWhere('u.id NOT IN (:...ids)', { ids: [...removedDuplicateUserIds] })
      .getMany();
    const toUserEmails = willInviteUsers.map((user) => user.userProvider.email);

    const noSignedUsers = inviteSubscriptionDto.emails.filter((toUserEmail) => !toUserEmails.includes(toUserEmail));
    if (noSignedUsers.length > 0) {
      throw new NoSignedUserExceptionDto(noSignedUsers);
    }

    const inviteUserOrganizationRoleDataList = willInviteUsers.map<Partial<OrganizationRole>>((user) => ({
      subscriptionId,
      userId: user.id,
      permissionId: (subscription as Subscription & { defaultPermission: Permission }).defaultPermission.id,
      status: OrganizationRoleStatusType.Invited,
    }));

    if (toUserEmails.length > 0) {
      await this.orm.getRepo(OrganizationRole).insert(inviteUserOrganizationRoleDataList);

      Promise.allSettled(
        toUserEmails.map((toUser) => {
          const token = this.utilService.createInvitationToken(subscriptionId, toUser, userId);
          const invitationVerificationLink = `${this.commonService.getConfig('common').clientUrl}/invitation?q=${token}`;

          return invitationEmailCallback(toUser, fromUser, subscription, invitationVerificationLink);
        }),
      ).catch((error) => {
        console.error('✨ email send error:', error);
      });
    }
  }

  async updateInvitationWithNotification(
    subscriptionId: number,
    userId: number,
    updateInvitationWithNotificationDto: UpdateInvitationWithNotificationPayloadDto,
  ) {
    const organizationRole = await this.orm.getRepo(OrganizationRole).findOne({
      where: {
        subscriptionId,
        userId,
        status: OrganizationRoleStatusType.Invited,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!organizationRole) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    await this.updateOrganizationRoleStatus(organizationRole.id, { status: updateInvitationWithNotificationDto.status });

    await this.toggleReadNotification(userId, updateInvitationWithNotificationDto.notificationId, {
      isRead: true,
      actionStatus:
        updateInvitationWithNotificationDto.status === OrganizationRoleStatusType.Joined
          ? NotificationActionStatus.Joined
          : NotificationActionStatus.Rejected,
    });
  }
}
