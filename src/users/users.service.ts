import { Organization } from '@/organizations/entities/organization.entity';
import { OrganizationRole } from '@/organizations/organization-roles/entities/organization-role.entity';
import { NotFoundPermissionExceptionDto } from '@/permissions/dto/exception/not-found-permission.exception.dto';
import { Permission } from '@/permissions/entities/permission.entity';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { DEFAULT_ORGANIZATION_NAME } from '@common/variable/globals';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly utilService: UtilService,
  ) {}

  async create({ password, ...createUserDto }: CreateUserPayloadDto) {
    // 1. 유저 생성
    // 2. 플랜 구독 (무료 플랜)
    // 3. 조직 생성
    // 4. 조직 역할 생성

    const alreadyExistUser = await this.userRepository.existsBy({
      email: createUserDto.email,
    });

    if (alreadyExistUser) {
      throw new AlreadyExistsUserExceptionDto(createUserDto.email);
    }

    const { hashedPassword, ...userSecret } = this.utilService.hashPassword(password);

    /* 유저 생성 */
    const { userSecret: _, ...newUser } = await this.userRepository.save({
      ...createUserDto,
      userSecret: { ...userSecret, password: hashedPassword },
    });

    /* 구독 생성 & 조직 생성 */
    const subscriptionData: Partial<Pick<Subscription, 'userId' | 'planId' | 'status' | 'target'> & { organization: Partial<Organization> }> = {
      userId: newUser.id,
      planId: 1,
      status: SubscriptionStatusType.ACTIVE,
      target: SubscriptionTargetType.USER,
      organization: {
        name: DEFAULT_ORGANIZATION_NAME,
        description: null,
        defaultRole: UserRole.Owner,
      },
    };
    const subscription = await this.userRepository.orm.getRepo(Subscription).save(subscriptionData);

    const organization = subscription.organization;

    const permission = await this.userRepository.orm.getRepo(Permission).findOne({
      where: {
        role: UserRole.Viewer,
      },
    });

    if (isNil(permission)) {
      throw new NotFoundPermissionExceptionDto();
    }

    /* 조직 역할 생성 */
    await this.userRepository.orm.getRepo(OrganizationRole).insert({
      userId: newUser.id,
      organizationId: organization.id,
      permissionId: permission.id,
    });

    return newUser;
  }

  async getMe(id: number): Promise<GetUserMeNestedResponseDto> {
    const user = await this.userRepository.getMe(id);

    if (isNil(user)) {
      throw new NotFoundUserExceptionDto();
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserPayloadDto) {
    const updated = await this.userRepository.save({ id, ...updateUserDto });
    return updated;
  }

  async remove(id: number) {
    return this.userRepository.softDelete(id);
  }
}
