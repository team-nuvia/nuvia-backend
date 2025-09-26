import { NotFoundNotificationExceptionDto } from '@/notifications/dto/exception/not-found-notification.exception.dto';
import { Notification } from '@/notifications/entities/notification.entity';
import { NotFoundPermissionExceptionDto } from '@/permissions/dto/exception/not-found-permission.exception.dto';
import { Permission } from '@/permissions/entities/permission.entity';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { NotFoundOrganizationRoleExceptionDto } from '@/subscriptions/organization-roles/dto/exception/not-found-organization-role.exception.dto';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { BaseRepository } from '@common/base.repository';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { NotificationActionStatus } from '@share/enums/notification-action-status';
import { NotificationType } from '@share/enums/notification-type';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole } from '@share/enums/user-role';
import { UserProvider } from '@users/entities/user-provider.entity';
import { User } from '@users/entities/user.entity';
import { Profile } from '@users/profiles/entities/profile.entity';
import { UserAccess } from '@users/user-accesses/entities/user-access.entity';
import { UserAccessStatusType } from '@users/user-accesses/enums/user-access-status-type';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { uniqueHash } from '@util/uniqueHash';
import sharp from 'sharp';
import { FindOptionsWhere } from 'typeorm';
import { UserLoginInformationPayloadDto } from './dto/payload/user-login-information.payload.dto';
import { AlreadyJoinedUserExceptionDto } from '@/subscriptions/dto/exception/already-joined-user.exception.dto';

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

  async socialLogin(token: SocialLoginGoogleIdTokenPayload, socialProvider: SocialProvider, imageBuffer: Buffer | null) {
    /* 사용자 계정 조회 */
    let user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userProviders', 'up')
      .where('up.email = :email AND up.provider = :provider', { email: token.email, provider: socialProvider })
      .getOne();

    /* 사용자 계정 없으면 생성 */
    if (isNil(user)) {
      const newUser = await this.orm.getRepo(User).insert({});
      await this.orm
        .getRepo(UserProvider)
        .createQueryBuilder()
        .insert()
        .values({
          userId: newUser.identifiers[0].id,
          providerId: token.sub,
          name: token.name,
          nickname: token.given_name,
          email: token.email,
          provider: socialProvider,
          image: token.picture,
        })
        .execute();

      user = await this.orm
        .getRepo(User)
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.userProviders', 'up')
        .where('up.email = :email AND up.provider = :provider', { email: token.email, provider: socialProvider })
        .getOne();

      if (user) {
        /* 프로필 이미지 등록 */
        if (imageBuffer) {
          const resizedImageBuffer = await sharp(imageBuffer)
            .resize(100, 100, { fit: 'contain', withoutEnlargement: true })
            .toFormat('png')
            .toBuffer();
          const filename = uniqueHash(80) + '.png';
          await this.orm.getRepo(Profile).insert({
            userId: user.id,
            buffer: resizedImageBuffer,
            size: resizedImageBuffer.length,
            width: 100,
            height: 100,
            originalname: filename,
            filename,
            mimetype: 'image/png',
          });
        }

        /* 구독 생성 & 조직 생성 */
        const subscriptionData: Partial<Pick<Subscription, 'userId' | 'planId' | 'status' | 'target' | 'name' | 'description' | 'defaultRole'>> = {
          userId: user.id,
          planId: 1,
          name: `${user.userProvider.name}님의 개인 문서`,
          description: null,
          defaultRole: UserRole.Owner,
          status: SubscriptionStatusType.Active,
          target: SubscriptionTargetType.Individual,
        };
        const subscription = await this.orm.getRepo(Subscription).save(subscriptionData);

        const permission = await this.orm.getRepo(Permission).findOne({
          where: {
            role: subscription.defaultRole,
          },
        });

        if (isNil(permission)) {
          throw new NotFoundPermissionExceptionDto();
        }

        /* 조직 역할 생성 */
        await this.orm.getRepo(OrganizationRole).insert({
          userId: user.id,
          subscriptionId: subscription.id,
          permissionId: permission.id,
          status: OrganizationRoleStatusType.Joined,
          isCurrentOrganization: true,
        });
      }
    }

    console.log('🚀 ~ AuthRepository ~ socialLogin ~ token:', token, imageBuffer);
    if (imageBuffer) {
      const resizedImageBuffer = await sharp(imageBuffer).resize(100, 100, { fit: 'contain', withoutEnlargement: true }).toFormat('png').toBuffer();
      const filename = uniqueHash(80) + '.png';
      await this.orm.getRepo(Profile).insert({
        userId: user!.id,
        buffer: resizedImageBuffer,
        size: resizedImageBuffer.length,
        width: 100,
        height: 100,
        originalname: filename,
        filename,
        mimetype: 'image/png',
      });
    }

    if (isNil(user)) {
      throw new NotFoundUserExceptionDto(token.email);
    }

    return user;
  }

  async findUserById(id: number, provider: SocialProvider): Promise<UserMinimumInformation> {
    const user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userProviders', 'up')
      .where('u.id = :id AND up.provider = :provider', { id, provider })
      .select(['u.id', 'up.email', 'up.name', 'up.nickname'])
      .getOne();

    if (isNil(user)) {
      throw new NotFoundUserExceptionDto(id.toString());
    }

    const subscription = await this.getCurrentOrganization(user.id);

    return {
      id: user.id,
      provider,
      email: user.userProvider.email,
      name: user.userProvider.name,
      nickname: user.userProvider.nickname,
      role: subscription.permission.role,
    };
  }

  async findUserWithSecret(email: string, provider: SocialProvider) {
    const user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userProviders', 'up')
      .leftJoinAndSelect('u.userSecret', 'us')
      .where('up.email = :email AND up.provider = :provider', { email, provider })
      .select(['u.id', 'up.email', 'up.name', 'up.nickname', 'us.id', 'us.salt', 'us.password', 'us.iteration'])
      .getOne();

    if (isNil(user) || isNil(user.userSecret)) {
      throw new NotFoundUserExceptionDto(email);
    }

    const subscription = await this.getCurrentOrganization(user.id);

    const combinedUser = {
      id: user.id,
      email: user.userProvider.email,
      name: user.userProvider.name,
      nickname: user.userProvider.nickname,
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
      // TODO: 로그 데이터 신뢰성이 떨어져서 누적할지 고민 중
      const lastUserAccess = await this.orm
        .getRepo(UserAccess)
        .createQueryBuilder('ua')
        .where('ua.userId = :id', { id })
        .andWhere('ua.lastAccessAt IS NOT NULL AND ua.lastAccessAt > :date', { date: new Date(Date.now() - 1000 * 60 * 60 * 24) })
        .orderBy('ua.lastAccessAt', 'DESC')
        .getOne();

      if (isNil(lastUserAccess)) {
        // throw new NotFoundUserAccessExceptionDto(id.toString());
        await this.orm.getRepo(UserAccess).insert(userAccess);
        return;
      }

      userAccess.accessDevice = lastUserAccess.accessDevice;
      userAccess.accessBrowser = lastUserAccess.accessBrowser;
      userAccess.accessUserAgent = lastUserAccess.accessUserAgent;
    }
    await this.orm.getRepo(UserAccess).insert(userAccess);
  }

  async joinOrganization(inviteeId: number, subscriptionId: number) {
    const rawInvitedList = await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .where('or.userId = :userId AND or.subscriptionId = :subscriptionId', { userId: inviteeId, subscriptionId })
      // .andWhere('or.status = :status', { status: OrganizationRoleStatusType.Invited })
      .andWhere('or.deletedAt IS NULL')
      .orderBy('or.createdAt', 'DESC')
      .getMany();

    const alreadyJoined = rawInvitedList.some((role) => role.status === OrganizationRoleStatusType.Joined);

    if (alreadyJoined) {
      throw new AlreadyJoinedUserExceptionDto();
    }

    const invitedList = rawInvitedList.filter((role) => role.status === OrganizationRoleStatusType.Invited);

    const organizationRole = invitedList[0];
    if (invitedList.length > 0) {
      await this.orm.getRepo(OrganizationRole).update(
        invitedList.slice(1).map((role) => ({ id: role.id })),
        { isCurrentOrganization: false, status: OrganizationRoleStatusType.Deleted, deletedAt: new Date() },
      );
    }

    if (isNil(organizationRole)) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    /* 초대할때 중복되면 이미 지우는 로직이 있기 때문에 Join 데이터만 처리 */
    await this.orm
      .getRepo(OrganizationRole)
      .update({ id: organizationRole.id }, { status: OrganizationRoleStatusType.Joined, isCurrentOrganization: false, deletedAt: null });

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
