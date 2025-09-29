import { NotFoundNotificationExceptionDto } from '@/notifications/dto/exception/not-found-notification.exception.dto';
import { Notification } from '@/notifications/entities/notification.entity';
import { NotFoundPermissionExceptionDto } from '@/permissions/dto/exception/not-found-permission.exception.dto';
import { Permission } from '@/permissions/entities/permission.entity';
import { AlreadyJoinedUserExceptionDto } from '@/subscriptions/dto/exception/already-joined-user.exception.dto';
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
import { UserAccessStatusType } from '@share/enums/user-access-status-type';
import { UserRole } from '@share/enums/user-role';
import { UserProvider } from '@users/entities/user-provider.entity';
import { User } from '@users/entities/user.entity';
import { Profile } from '@users/profiles/entities/profile.entity';
import { UserAccess } from '@users/user-accesses/entities/user-access.entity';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { uniqueHash } from '@util/uniqueHash';
import sharp from 'sharp';
import { FindOptionsWhere } from 'typeorm';
import { UserLoginInformationPayloadDto } from './dto/payload/user-login-information.payload.dto';
import { BadRequestException } from '@common/dto/response';
import { UtilService } from '@util/util.service';

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(
    protected readonly orm: OrmHelper,
    private readonly utilService: UtilService,
  ) {
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

  private createHashedProviderId(providerId: string) {
    const signature = `${providerId}:${Date.now()}`;
    return this.utilService.createHash(signature);
  }

  /**
   * 소셜 프로바이더 정보 생성
   * 소셜 프로바이더 ID를 해시토큰으로 변환하여 저장
   * @param socialProvider 소셜 프로바이더
   * @param userId 유저 ID
   * @param token 소셜 토큰
   * @returns 소셜 프로바이더 정보
   */
  private getProviderInformation<T extends SocialProvider>(
    socialProvider: T,
    userId: number,
    token: SocialLoginGoogleIdTokenPayload | SocialLoginKakaoIdTokenPayload,
  ) {
    switch (socialProvider) {
      case SocialProvider.Google: {
        const googleToken = token as SocialLoginGoogleIdTokenPayload;
        return {
          userId: userId,
          providerId: this.createHashedProviderId(googleToken.sub),
          name: googleToken.name,
          nickname: googleToken.given_name,
          email: googleToken.email,
          provider: socialProvider,
          image: googleToken.picture,
        };
      }
      case SocialProvider.Kakao: {
        const kakaoToken = token as SocialLoginKakaoIdTokenPayload;
        return {
          userId: userId,
          providerId: this.createHashedProviderId(kakaoToken.sub),
          name: kakaoToken.nickname,
          nickname: kakaoToken.nickname,
          email: kakaoToken.email,
          provider: socialProvider,
          image: kakaoToken.picture,
        };
      }
      default:
        throw new BadRequestException({ code: 'BAD_REQUEST', reason: 'Invalid social provider' });
    }
  }

  async socialLogin(
    token: SocialLoginGoogleIdTokenPayload | SocialLoginKakaoIdTokenPayload,
    socialProvider: SocialProvider,
    imageBuffer: Buffer | null,
  ) {
    // - 이미 로컬 계정 있고, provider 없을 때 (선 로컬 로그인)
    // - 이미 로컬 있고, provider도 통합됐을 때 (이미 통합한 경우)
    // - 로컬 없고, provider도 없을 때 (초기 사용자)
    // - 로컬 없고, provider 있을 때 (선 소셜 로그인)

    // 1. email로 local 유형 유저가 있는지 확인
    // 2. local이 있으면 provider 통합
    // 3. local이 없으면 새로운 user 계정 생성

    const hasAlreadyExists = {
      local: false,
      social: false,
    };
    const localUser = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userProviders', 'up')
      .where('up.email = :email AND up.provider = :provider', { email: token.email, provider: SocialProvider.Local })
      .getOne();

    if (localUser) {
      // 로컬 계정 있는 경우
      hasAlreadyExists.local = true;
      const isProviderAlreadyExists = localUser.userProviders.some(
        (userProvider) => userProvider.provider === socialProvider && userProvider.providerId === token.sub,
      );
      if (isProviderAlreadyExists) {
        // 이미 소셜 통합된 계정 - 넘어감
        hasAlreadyExists.social = true;
      } else {
        // 소셜 통합 안된 계정 - 신규 연동
        const providerInformation = this.getProviderInformation(socialProvider, localUser.id, token);
        await this.orm.getRepo(UserProvider).insert(providerInformation);
      }
    } else {
      // 로컬 계정 없는 경우
      const socialUser = await this.orm
        .getRepo(User)
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.userProviders', 'up')
        .where('up.email = :email AND up.provider = :provider', { email: token.email, provider: socialProvider })
        .getOne();

      if (socialUser) {
        // 이미 소셜 계정 있는 경우 - 넘어감
        hasAlreadyExists.social = true;
      } else {
        hasAlreadyExists.social = false;
        // 이미 소셜 계정 없는 경우 - 신규 연동
        const user = await this.orm.getRepo(User).insert({});
        const id = user.identifiers[0].id;
        const providerInformation = this.getProviderInformation(socialProvider, id, token);
        const userProvider = this.orm.getRepo(UserProvider).create(providerInformation);
        await this.orm.getRepo(UserProvider).insert(userProvider);
      }
    }

    /* 무조건 있는 데이터 */
    const newOrUpdatedUser = (await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userProviders', 'up')
      .where('up.email = :email AND up.provider = :provider', { email: token.email, provider: socialProvider })
      .getOne())!;

    if (isNil(newOrUpdatedUser)) {
      throw new NotFoundUserExceptionDto(token.email);
    }

    /* 이미 소셜 계정 있으면 early return */
    if (hasAlreadyExists.social) {
      return newOrUpdatedUser;
    }

    /* 아래부터 소셜 계정 없는 경우 처리 */

    const hasProfile = await this.orm.getRepo(Profile).exists({
      where: {
        userId: newOrUpdatedUser.id,
      },
    });

    /* 프로필 이미지 등록 */
    if (imageBuffer && !hasProfile) {
      const resizedImageBuffer = await sharp(imageBuffer).resize(100, 100, { fit: 'contain', withoutEnlargement: true }).toFormat('png').toBuffer();
      const filename = uniqueHash(80) + '.png';
      await this.orm.getRepo(Profile).insert({
        userId: newOrUpdatedUser.id,
        buffer: Buffer.from(resizedImageBuffer),
        size: resizedImageBuffer.length,
        width: 100,
        height: 100,
        originalname: filename,
        filename,
        mimetype: 'image/png',
      });
    }

    /* 이미 로컬 계정 있으면 early return */
    if (hasAlreadyExists.local) {
      return newOrUpdatedUser;
    }

    /* 구독 생성 & 조직 생성 */
    const subscriptionData: Partial<Pick<Subscription, 'userId' | 'planId' | 'status' | 'target' | 'name' | 'description' | 'defaultRole'>> = {
      userId: newOrUpdatedUser.id,
      planId: 1,
      name: `${newOrUpdatedUser.userProvider.name}님의 개인 문서`,
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
      userId: newOrUpdatedUser.id,
      subscriptionId: subscription.id,
      permissionId: permission.id,
      status: OrganizationRoleStatusType.Joined,
      isCurrentOrganization: true,
    });

    return newOrUpdatedUser;
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

    /* 초대할때 중복되면 이미 지우는 로직이 있기 때문에 Joined 데이터만 처리 */
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
