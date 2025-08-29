import { NotFoundNotificationExceptionDto } from '@/notifications/dto/exception/not-found-notification.exception.dto';
import { Notification } from '@/notifications/entities/notification.entity';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { BaseRepository } from '@common/base.repository';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { NotificationActionStatus } from '@share/enums/notification-action-status';
import { NotificationType } from '@share/enums/notification-type';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { User } from '@users/entities/user.entity';
import { UserAccess } from '@users/user-accesses/entities/user-access.entity';
import { UserAccessStatusType } from '@users/user-accesses/enums/user-access-status-type';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { NotFoundUserAccessExceptionDto } from './dto/exception/not-found-user-access.exception.dto';
import { UserLoginInformationPayloadDto } from './dto/payload/user-login-information.payload.dto';

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(protected readonly orm: OrmHelper) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(User).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<User>): Promise<boolean> {
    return this.orm.getRepo(User).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<User>): Promise<boolean> {
    return this.orm.getRepo(User).exists({ where: condition });
  }

  async findUserById(id: number): Promise<UserMinimumInformation> {
    const user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .select(['u.id', 'u.email', 'u.name', 'u.nickname'])
      .getOne();

    if (isNil(user)) {
      throw new NotFoundUserExceptionDto(id.toString());
    }

    const subscription = await this.getCurrentOrganization(user.id);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      role: subscription.permission.role,
    };
  }

  async findUserWithSecret(email: string) {
    const user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .leftJoinAndSelect('u.userSecret', 'us')
      .select(['u.id', 'u.email', 'u.name', 'u.nickname', 'us.id', 'us.salt', 'us.password', 'us.iteration'])
      .getOne();

    if (isNil(user) || isNil(user.userSecret)) {
      throw new NotFoundUserExceptionDto(email);
    }

    const subscription = await this.getCurrentOrganization(user.id);

    const combinedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      role: subscription.permission.role,
      userSecret: user.userSecret,
    };
    return combinedUser;
  }

  async addUserAccessLog(
    id: number,
    ipAddress: string,
    userLoginInformationPayloadDto: UserLoginInformationPayloadDto | null,
    accessStatus: UserAccessStatusType,
  ) {
    const userAccess = new UserAccess();
    userAccess.userId = id;
    userAccess.accessIp = ipAddress;
    userAccess.status = accessStatus;
    userAccess.lastAccessAt = new Date();

    if (userLoginInformationPayloadDto) {
      userAccess.accessDevice = userLoginInformationPayloadDto.accessDevice;
      userAccess.accessBrowser = userLoginInformationPayloadDto.accessBrowser;
      userAccess.accessUserAgent = userLoginInformationPayloadDto.accessUserAgent;
    } else {
      const lastUserAccess = await this.orm
        .getRepo(UserAccess)
        .createQueryBuilder('ua')
        .where('ua.userId = :id', { id })
        .andWhere('ua.lastAccessAt IS NOT NULL AND ua.lastAccessAt > :date', { date: new Date(Date.now() - 1000 * 60 * 60 * 24) })
        .orderBy('ua.lastAccessAt', 'DESC')
        .getOne();

      if (isNil(lastUserAccess)) {
        throw new NotFoundUserAccessExceptionDto(id.toString());
      }

      userAccess.accessDevice = lastUserAccess.accessDevice;
      userAccess.accessBrowser = lastUserAccess.accessBrowser;
      userAccess.accessUserAgent = lastUserAccess.accessUserAgent;
    }
    await this.orm.getRepo(UserAccess).insert(userAccess);
  }

  async joinOrganization(inviteeId: number, subscriptionId: number) {
    /* 초대할때 중복되면 이미 지우는 로직이 있기 때문에 Join 데이터만 처리 */
    await this.orm
      .getRepo(OrganizationRole)
      .update({ userId: inviteeId, subscriptionId }, { status: OrganizationRoleStatusType.Joined, isCurrentOrganization: false, deletedAt: null });

    const notification = await this.orm.getRepo(Notification).findOne({
      where: { toId: inviteeId, type: NotificationType.Invitation, referenceId: subscriptionId },
      order: { createdAt: 'DESC' },
    });

    if (!notification) {
      throw new NotFoundNotificationExceptionDto();
    }

    await this.orm.getRepo(Notification).update({ id: notification.id }, { actionStatus: NotificationActionStatus.Joined });
  }
}
