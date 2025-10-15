import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { CurrentOrganizationNestedResponseDto } from '@/subscriptions/organization-roles/dto/response/current-organization.nested.response.dto';
import { GetCurrentOrganizationsNestedResponseDto } from '@/subscriptions/organization-roles/dto/response/get-current-organizations.nested.response.dto';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { BaseRepository } from '@common/base.repository';
import { CommonService } from '@common/common.service';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { BadRequestException } from '@common/dto/response';
import { Injectable } from '@nestjs/common';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { UserAccessStatusType } from '@share/enums/user-access-status-type';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { DeepPartial, FindOptionsWhere, Not, ObjectLiteral } from 'typeorm';
import { AlreadyExistsEmailExceptionDto } from './dto/exception/already-exists-email.exception.dto';
import { AlreadyExistsNicknameExceptionDto } from './dto/exception/already-exists-nickname.exception.dto';
import { UpdateUserMePayloadDto } from './dto/payload/update-user-me.payload.dto';
import { GetUserMeNestedResponseDto } from './dto/response/get-user-me.nested.response.dto';
import { GetUserSettingsNestedResponseDto } from './dto/response/get-user-settings.nested.response.dto';
import { UserProvider } from './entities/user-provider.entity';
import { User } from './entities/user.entity';
import { Profile } from './profiles/entities/profile.entity';
import { UserAccess } from './user-accesses/entities/user-access.entity';
import { UserSecret } from './user-secrets/entities/user-secret.entity';

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(
    readonly orm: OrmHelper,
    private readonly commonService: CommonService,
  ) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(User).softDelete(id);
  }

  async softDeleteWithUserProviders(userData: LoginUserData): Promise<void> {
    const user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userProviders', 'up', 'up.deletedAt IS NULL')
      .where('u.id = :id', { id: userData.id })
      .getOne();

    if (isNil(user)) {
      throw new NotFoundUserExceptionDto();
    }

    const softDeleteTargets = [
      { entity: UserProvider, data: { userId: user.id } },
      { entity: UserSecret, data: { userId: user.id } },
      { entity: Profile, data: { userId: user.id } },
      { entity: UserAccess, data: { userId: user.id } },
      { entity: User, data: { id: user.id } },
      // { entity: Survey, userId: user.id },
      { entity: OrganizationRole, data: { userId: user.id } },
      { entity: Subscription, data: { userId: user.id } },
    ];

    await this.orm.getRepo(UserAccess).insert({ userId: user.id, status: UserAccessStatusType.Deleted });

    await Promise.all(softDeleteTargets.map(({ entity, data }) => this.orm.getRepo(entity as new () => ObjectLiteral).softDelete(data)));

    /* 마지막 유저 프로바이더일 시 유저 제거 */
    // if (user.userProviders.length === 1) {
    //   // TODO: 조직 제거 시 팀 조직 마스터일 경우 관리자에게 권한 이전할지 여부 확인
    //   const subscription = await this.orm
    //     .getRepo(Subscription)
    //     .createQueryBuilder('s')
    //     .where('s.userId = :userId', { userId: user.id, target: SubscriptionTargetType.Individual })
    //     .getOne();

    //   if (subscription) {
    //     await this.orm.getRepo(Survey).softDelete({ userId: user.id, subscriptionId: subscription.id });
    //     await this.orm.getRepo(OrganizationRole).softDelete({ userId: user.id, subscriptionId: subscription.id });
    //     await this.orm.getRepo(Subscription).update(subscription.id, { status: SubscriptionStatusType.Deleted });
    //   }

    //   await this.orm.getRepo(User).softDelete({ id: user.id });
    //   await this.orm.getRepo(UserAccess).softDelete({ userId: user.id });
    //   await this.orm.getRepo(Profile).softDelete({ userId: user.id });
    //   /* 아래는 확실히 제거하기 위함 */
    //   await this.orm.getRepo(UserProvider).softDelete({ userId: user.id });
    //   await this.orm.getRepo(UserSecret).softDelete({ userId: user.id });
    // }
  }

  existsByWithDeleted(condition: FindOptionsWhere<User>): Promise<boolean> {
    return this.orm.getRepo(User).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<UserProvider>): Promise<boolean> {
    return this.orm.getRepo(UserProvider).exists({ where: { ...condition } });
  }

  async getUserOrganizationData(userId: number): Promise<GetCurrentOrganizationsNestedResponseDto> {
    const { currentOrganization, organizations } = await super.getUserOrganizations(userId);

    const composedCurrentOrganization: CurrentOrganizationNestedResponseDto = {
      id: currentOrganization.id,
      organizationId: currentOrganization.organizationId,
      name: currentOrganization.name,
      description: currentOrganization.description,
      target: currentOrganization.target,
      status: currentOrganization.status,
      role: currentOrganization.permission.role,
      plan: currentOrganization.plan.name,
      createdAt: currentOrganization.createdAt,
    };

    const composedOrganizations = organizations.map<CurrentOrganizationNestedResponseDto>((organization) => ({
      id: organization.id,
      organizationId: organization.organizationId,
      name: organization.name,
      description: organization.description,
      target: organization.target,
      status: organization.status,
      role: organization.permission.role,
      plan: organization.plan.name,
      createdAt: organization.createdAt,
    }));

    return { currentOrganization: composedCurrentOrganization, organizations: composedOrganizations };
  }

  async getMe(userId: number, provider: SocialProvider): Promise<GetUserMeNestedResponseDto | null> {
    const subscription = await this.getCurrentOrganization(userId);

    const userMeData = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'up')
      .leftJoinAndSelect('u.userSecret', 'us')
      .leftJoinAndSelect('u.userProviders', 'up2', 'up2.provider = :provider', { provider })
      .leftJoinAndMapOne(
        'u.userAccess',
        UserAccess,
        'ua',
        'ua.last_access_at IS NOT NULL AND ua.id = (SELECT MAX(ua2.id) FROM user_access ua2 WHERE ua2.user_id = u.id)',
      )
      .where('u.id = :userId', { userId })
      .select([
        'u.id',
        'u.termsAgreed',
        'u.createdAt',
        'u.updatedAt',
        'up2.email',
        'up2.name',
        'up2.nickname',
        'up2.provider',
        'up.id',
        'up.filename',
        'up.originalname',
        'ua.id',
        'ua.lastAccessAt',
        'us.id',
        'us.updatedAt',
      ])
      .getOne();

    if (isNil(userMeData)) {
      throw new NotFoundUserExceptionDto();
    }

    const profileImageUrl = userMeData.getProfileUrl(this.commonService);

    const responseGetMeData: GetUserMeNestedResponseDto = {
      id: userMeData.id,
      email: userMeData.userProvider.email,
      name: userMeData.userProvider.name,
      nickname: userMeData.userProvider.nickname,
      role: subscription.permission.role,
      provider: userMeData.userProvider.provider,
      termsAgreed: userMeData.termsAgreed,
      currentOrganization: {
        id: subscription.id,
        organizationId: subscription.organizationId,
        name: subscription.name,
        description: subscription.description,
        target: subscription.target,
        status: subscription.status,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      },
      createdAt: userMeData.createdAt,
      updatedAt: userMeData.updatedAt,
      lastAccessAt: (userMeData as User & { userAccess: UserAccess }).userAccess?.lastAccessAt ?? null,
      lastUpdatedAt: userMeData.userSecret?.updatedAt ?? null,
      profileImageUrl,
    };

    return responseGetMeData;
  }

  async getUserSettings(userId: number, provider: SocialProvider): Promise<GetUserSettingsNestedResponseDto> {
    const userProvider = await this.orm.getRepo(UserProvider).findOne({ where: { userId, provider }, select: ['mailing'] });

    if (!userProvider) {
      throw new NotFoundUserExceptionDto();
    }

    return {
      mailing: Boolean(userProvider.mailing),
    };
  }

  findOneByEmail(email: string, provider: SocialProvider): Promise<UserProvider | null> {
    return this.orm
      .getRepo(UserProvider)
      .createQueryBuilder('up')
      .where('up.provider = :provider', { provider })
      .andWhere('up.email = :email', { email })
      .getOne();
  }

  async createUserAndProvider(data: {
    userProvider: DeepPartial<UserProvider>;
    userSecret: DeepPartial<UserSecret>;
    termsAgreed: boolean;
  }): Promise<User> {
    if (!data.userProvider.email || !data.userProvider.provider) {
      throw new BadRequestException();
    }

    const user = await this.findOneByEmail(data.userProvider.email, data.userProvider.provider);
    if (user) {
      throw new AlreadyExistsEmailExceptionDto();
    }

    const newUser = await this.orm.getRepo(User).insert({ termsAgreed: data.termsAgreed });
    console.log('newUser', newUser);

    const id = newUser.identifiers[0].id;
    console.log('id', id);

    await this.orm.getRepo(UserProvider).save({ userId: id, ...data.userProvider });

    await this.orm.getRepo(UserSecret).save({ userId: id, ...data.userSecret });

    const readNewUser = await this.orm.getRepo(User).findOne({ where: { id: id }, relations: ['userProviders', 'userSecret'] });
    console.log('readNewUser', readNewUser);

    return readNewUser!;
  }

  async saveUserProvider(id: number, userProvider: DeepPartial<UserProvider>): Promise<UserProvider> {
    const user = await this.orm.getRepo(User).findOne({ where: { id, userProviders: { provider: userProvider.provider } } });

    if (!user) {
      throw new NotFoundUserExceptionDto();
    }

    return this.orm.getRepo(UserProvider).save({ ...userProvider, userId: user.id });
  }

  async updateUserCurrentOrganization(userId: number, organizationId: number): Promise<void> {
    await this.orm.getRepo(OrganizationRole).update({ userId, isCurrentOrganization: true }, { isCurrentOrganization: false });
    await this.orm
      .getRepo(OrganizationRole)
      .update({ userId, subscriptionId: organizationId, status: OrganizationRoleStatusType.Joined }, { isCurrentOrganization: true });
  }

  async updateUserSettings(userId: number, mailing: boolean): Promise<void> {
    await this.orm.getRepo(UserProvider).update({ userId }, { mailing });
  }

  async updateUserMe(user: LoginUserData, updateUserMeDto: UpdateUserMePayloadDto) {
    const hasNickname = await this.orm.getRepo(UserProvider).exists({ where: { userId: Not(user.id), nickname: updateUserMeDto.nickname } });

    if (hasNickname) {
      throw new AlreadyExistsNicknameExceptionDto();
    }

    await this.orm.getRepo(UserProvider).update({ userId: user.id, provider: user.provider }, { nickname: updateUserMeDto.nickname });
  }
}
