import { NotFoundPermissionExceptionDto } from '@/permissions/dto/exception/not-found-permission.exception.dto';
import { Permission } from '@/permissions/entities/permission.entity';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { GetCurrentOrganizationsNestedResponseDto } from '@/subscriptions/organization-roles/dto/response/get-current-organizations.nested.response.dto';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole } from '@share/enums/user-role';
import { isNil } from '@util/isNil';
import { UtilService } from '@util/util.service';
import { AlreadyExistsUserExceptionDto } from './dto/exception/already-exists-user.exception.dto';
import { CreateUserPayloadDto } from './dto/payload/create-user.payload.dto';
import { UpdateUserPayloadDto } from './dto/payload/update-user.payload.dto';
import { GetUserMeNestedResponseDto } from './dto/response/get-user-me.nested.response.dto';
import { UsersRepository } from './users.repository';
import { SocialProvider } from '@share/enums/social-provider.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly utilService: UtilService,
  ) {}

  async create({ password, ...createUserDto }: CreateUserPayloadDto) {
    const alreadyExistUserEmail = await this.userRepository.existsBy({
      email: createUserDto.email,
      provider: createUserDto.provider,
    });

    if (alreadyExistUserEmail) {
      throw new AlreadyExistsUserExceptionDto('email');
    }

    const alreadyExistUserNickname = await this.userRepository.existsBy({
      nickname: createUserDto.nickname,
      provider: createUserDto.provider,
    });

    if (alreadyExistUserNickname) {
      throw new AlreadyExistsUserExceptionDto('nickname');
    }

    const { hashedPassword, ...userSecret } = this.utilService.hashPassword(password);

    /* 유저 생성 */
    const {
      userSecret: _,
      userProvider,
      ...newUser
    } = await this.userRepository.createUserAndProvider({
      userProvider: {
        email: createUserDto.email,
        name: createUserDto.name,
        nickname: createUserDto.nickname,
        provider: createUserDto.provider,
        providerId: null,
      },
      userSecret: { ...userSecret, password: hashedPassword },
    });

    /* 구독 생성 & 조직 생성 */
    const subscriptionData: Partial<Pick<Subscription, 'userId' | 'planId' | 'status' | 'target' | 'name' | 'description' | 'defaultRole'>> = {
      userId: newUser.id,
      planId: 1,
      name: `${userProvider.name}님의 개인 문서`,
      description: null,
      defaultRole: UserRole.Owner,
      status: SubscriptionStatusType.Active,
      target: SubscriptionTargetType.Individual,
    };
    const subscription = await this.userRepository.orm.getRepo(Subscription).save(subscriptionData);

    const permission = await this.userRepository.orm.getRepo(Permission).findOne({
      where: {
        role: subscription.defaultRole,
      },
    });

    if (isNil(permission)) {
      throw new NotFoundPermissionExceptionDto();
    }

    /* 조직 역할 생성 */
    await this.userRepository.orm.getRepo(OrganizationRole).insert({
      userId: newUser.id,
      subscriptionId: subscription.id,
      permissionId: permission.id,
      status: OrganizationRoleStatusType.Joined,
      isCurrentOrganization: true,
    });

    return newUser;
  }

  async getUserOrganizations(userId: number): Promise<GetCurrentOrganizationsNestedResponseDto> {
    const userOrganizations = await this.userRepository.getUserOrganizationData(userId);
    return userOrganizations;
  }

  async getMe(id: number, provider: SocialProvider): Promise<GetUserMeNestedResponseDto> {
    const user = await this.userRepository.getMe(id, provider);

    if (isNil(user)) {
      throw new NotFoundUserExceptionDto();
    }

    return user;
  }

  async updateUserSettings(userId: number, mailing: boolean): Promise<void> {
    await this.userRepository.updateUserSettings(userId, mailing);
    return;
  }

  async updateUserCurrentOrganization(userId: number, organizationId: number): Promise<void> {
    await this.userRepository.updateUserCurrentOrganization(userId, organizationId);
    return;
  }

  async update(id: number, updateUserDto: UpdateUserPayloadDto) {
    const updated = await this.userRepository.saveUserProvider(id, { ...updateUserDto });
    return updated;
  }

  async remove(id: number) {
    await this.userRepository.softDelete(id);
  }
}
