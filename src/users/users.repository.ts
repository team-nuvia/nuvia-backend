import { CurrentOrganizationNestedResponseDto } from '@/subscriptions/organization-roles/dto/response/current-organization.nested.response.dto';
import { GetCurrentOrganizationsNestedResponseDto } from '@/subscriptions/organization-roles/dto/response/get-current-organizations.nested.response.dto';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { BaseRepository } from '@common/base.repository';
import { CommonService } from '@common/common.service';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { AlreadyExistsEmailExceptionDto } from './dto/exception/already-exists-email.exception.dto';
import { GetUserMeNestedResponseDto } from './dto/response/get-user-me.nested.response.dto';
import { UserProvider } from './entities/user-provider.entity';
import { User } from './entities/user.entity';
import { UserAccess } from './user-accesses/entities/user-access.entity';
import { UserSecret } from './user-secrets/entities/user-secret.entity';
import { BadRequestException } from '@common/dto/response';

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
      .leftJoinAndSelect('u.userProviders', 'up2', 'up2.provider = :provider', { provider })
      .leftJoinAndMapOne(
        'u.userAccess',
        UserAccess,
        'ua',
        'ua.last_access_at IS NOT NULL AND ua.id = (SELECT MAX(ua2.id) FROM user_access ua2 WHERE ua2.user_id = u.id)',
      )
      .where('u.id = :userId', { userId })
      .select(['u.id', 'up2.email', 'up2.name', 'up2.nickname', 'u.createdAt', 'up.id', 'up.filename', 'up.originalname', 'ua.id', 'ua.lastAccessAt'])
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
      lastAccessAt: (userMeData as User & { userAccess: UserAccess }).userAccess?.lastAccessAt ?? null,
      profileImageUrl,
    };

    return responseGetMeData;
  }

  findOneByEmail(email: string, provider: SocialProvider): Promise<UserProvider | null> {
    return this.orm
      .getRepo(UserProvider)
      .createQueryBuilder('up')
      .where('up.provider = :provider', { provider })
      .andWhere('up.email = :email', { email })
      .getOne();
  }

  async createUserAndProvider(data: { userProvider: DeepPartial<UserProvider>; userSecret: DeepPartial<UserSecret> }): Promise<User> {
    if (!data.userProvider.email || !data.userProvider.provider) {
      throw new BadRequestException();
    }

    const user = await this.findOneByEmail(data.userProvider.email, data.userProvider.provider);
    if (user) {
      throw new AlreadyExistsEmailExceptionDto();
    }

    const newUser = await this.orm.getRepo(User).insert({});

    await this.orm.getRepo(UserProvider).save({ userId: newUser.identifiers[0].id, ...data.userProvider });

    await this.orm.getRepo(UserSecret).save({ userId: newUser.identifiers[0].id, ...data.userSecret });

    const readNewUser = await this.orm.getRepo(User).findOne({ where: { id: newUser.identifiers[0].id } });

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
}
