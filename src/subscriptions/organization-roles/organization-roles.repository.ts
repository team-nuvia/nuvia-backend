import { NotFoundPermissionExceptionDto } from '@/permissions/dto/exception/not-found-permission.exception.dto';
import { Permission } from '@/permissions/entities/permission.entity';
import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { UserRole, UserRoleList } from '@share/enums/user-role';
import { OrmHelper } from '@util/orm.helper';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { NotFoundSubscriptionExceptionDto } from '../dto/exception/not-found-subscription.exception.dto';
import { Subscription } from '../entities/subscription.entity';
import { NotAllowedUpdateOrganizationRoleExceptionDto } from './dto/exception/not-allowed-update-organization-role.exception.dto';
import { NotFoundOrganizationRoleExceptionDto } from './dto/exception/not-found-organization-role.exception.dto';
import { UpdateOrganizationRolePayloadDto } from './dto/payload/update-organization-role.payload.dto';
import { TableOrganizationRoleNestedResponseDto } from './dto/response/table-organization-role.nested.response.dto';
import { OrganizationRole } from './entities/organization-role.entity';
import { NotificationType } from '@share/enums/notification-type';
import { isRoleAtLeast } from '@util/isRoleAtLeast';
import { EmailsService } from '@/emails/emails.service';
import { LocalizationManager } from '@util/LocalizationManager';

@Injectable()
export class OrganizationRolesRepository extends BaseRepository {
  constructor(
    readonly orm: OrmHelper,
    private readonly emailsService: EmailsService,
  ) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(OrganizationRole).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<OrganizationRole>): Promise<boolean> {
    return this.orm.getRepo(OrganizationRole).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<OrganizationRole>): Promise<boolean> {
    return this.orm.getRepo(OrganizationRole).exists({ where: condition });
  }

  async findAll(subscriptionId: number): Promise<TableOrganizationRoleNestedResponseDto[]> {
    const roles = await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .leftJoinAndSelect('or.user', 'u')
      .leftJoinAndSelect('u.userProviders', 'up')
      .leftJoinAndSelect('or.permission', 'p')
      .where('or.subscriptionId = :subscriptionId', { subscriptionId })
      .andWhere('or.status IN (:...status)', {
        status: [OrganizationRoleStatusType.Joined, OrganizationRoleStatusType.Deactivated, OrganizationRoleStatusType.Invited],
      })
      .getMany();

    const composedRoles = roles.map((role) => ({
      id: role.id,
      name: role.user.userProvider.name,
      email: role.user.userProvider.email,
      role: role.permission.role,
      status: role.status,
      createdAt: role.createdAt,
    }));

    return composedRoles;
  }

  async update(
    subscriptionId: number, // 수정 대상 조직 ID
    organizationRoleId: number, // 수정 대상 역할 ID
    userId: number, // 수정 시도 유저 ID
    updateOrganizationRolePayloadDto: UpdateOrganizationRolePayloadDto,
  ) {
    /* 수정 조직 */
    const subscription = await this.orm
      .getRepo(Subscription)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.organizationRoles', 'or')
      .leftJoinAndSelect('or.permission', 'p')
      .leftJoinAndSelect('or.user', 'oru')
      .leftJoinAndSelect('oru.userProviders', 'up')
      .where('s.id = :subscriptionId', { subscriptionId })
      .getOne();

    /* 조직 존재 여부 검증 */
    if (!subscription) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    /* 수정 대상 역할 */
    const targetUserRole = subscription.organizationRoles.find((role) => role.id === organizationRoleId);

    /* 수정 유저 */
    const fromUserRole = subscription.organizationRoles.find((role) => role.userId === userId);

    /* 조직 역할 존재 여부 검증 */
    if (!fromUserRole || !targetUserRole) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    /* 본인 데이터 수정 시도 검증 */
    if (targetUserRole.userId === userId) {
      throw new NotAllowedUpdateOrganizationRoleExceptionDto('본인의 역할 정보를 수정할 수 없습니다.');
    }

    /* 조직 생성자 수정 시도 검증 */
    if (targetUserRole.userId === subscription.userId) {
      throw new NotAllowedUpdateOrganizationRoleExceptionDto('조직 생성자의 역할 정보를 수정할 수 없습니다.');
    }

    if (updateOrganizationRolePayloadDto.role === UserRole.Owner) {
      throw new NotAllowedUpdateOrganizationRoleExceptionDto('소유자 역할은 부여할 수 없습니다.');
    }

    const isOverRole = UserRoleList.indexOf(fromUserRole.permission.role) < UserRoleList.indexOf(updateOrganizationRolePayloadDto.role);
    if (isOverRole) {
      throw new NotAllowedUpdateOrganizationRoleExceptionDto('본인의 역할보다 높은 역할로 수정할 수 없습니다.');
    }

    const permission = await this.orm.getRepo(Permission).findOne({ where: { role: updateOrganizationRolePayloadDto.role } });

    if (!permission) {
      throw new NotFoundPermissionExceptionDto();
    }

    if (
      ![OrganizationRoleStatusType.Joined, OrganizationRoleStatusType.Deactivated, OrganizationRoleStatusType.Deleted].includes(
        updateOrganizationRolePayloadDto.status as 'joined' | 'deactivated' | 'deleted',
      )
    ) {
      throw new NotAllowedUpdateOrganizationRoleExceptionDto('잘못된 조직 역할 상태입니다.');
    }

    const updateData: DeepPartial<OrganizationRole> = {
      permissionId: permission.id,
    };

    const isMinAdmin = isRoleAtLeast(fromUserRole.permission.role, UserRole.Admin);

    if (isMinAdmin) {
      updateData.status = updateOrganizationRolePayloadDto.status;
    }

    await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .update()
      .set(updateData)
      .where('subscriptionId = :subscriptionId', { subscriptionId })
      .andWhere('id = :organizationRoleId', { organizationRoleId: organizationRoleId })
      .execute();

    /* 최소 관리자 권한이 아니면 종료 */
    if (!isMinAdmin) return;

    if (targetUserRole.permission.role !== updateOrganizationRolePayloadDto.role) {
      await this.addNotifications({
        subscriptionId,
        type: NotificationType.Notice,
        userId,
        emails: [targetUserRole.user.userProvider.email],
        title: '역할 변경 알림',
        content: `${subscription.name} 조직에서 ${targetUserRole.user.userProvider.name}님의 역할을 "${LocalizationManager.translate(targetUserRole.permission.role)}"에서 "${LocalizationManager.translate(updateOrganizationRolePayloadDto.role)}"로 변경했습니다.`,
      });

      if (targetUserRole.user.userProvider.mailing) {
        await this.emailsService.sendNoticeMail(targetUserRole.user.userProvider.email, {
          title: '역할 변경 알림',
          content: `${subscription.name} 조직에서 ${targetUserRole.user.userProvider.name}님의 역할을 "${LocalizationManager.translate(targetUserRole.permission.role)}"에서 "${LocalizationManager.translate(updateOrganizationRolePayloadDto.role)}"로 변경했습니다.`,
          toUserName: targetUserRole.user.userProvider.name,
          organizationName: subscription.name,
        });
      }
    }

    if (
      targetUserRole.status !== OrganizationRoleStatusType.Deactivated &&
      updateOrganizationRolePayloadDto.status === OrganizationRoleStatusType.Deactivated
    ) {
      await this.addNotifications({
        subscriptionId,
        type: NotificationType.Notice,
        userId,
        emails: [targetUserRole.user.userProvider.email],
        title: '조직 활동 정지 알림',
        content: `${subscription.name} 조직에서 ${targetUserRole.user.userProvider.name}님의 활동을 정지시켰습니다.`,
      });

      if (targetUserRole.user.userProvider.mailing) {
        await this.emailsService.sendNoticeMail(targetUserRole.user.userProvider.email, {
          title: '조직 활동 정지 알림',
          content: `${subscription.name} 조직에서 ${targetUserRole.user.userProvider.name}님의 활동을 정지시켰습니다.`,
          toUserName: targetUserRole.user.userProvider.name,
          organizationName: subscription.name,
        });
      }

      await this.initializeCurrentOrganization(targetUserRole.user.id);
    }

    if (
      targetUserRole.status !== OrganizationRoleStatusType.Deleted &&
      updateOrganizationRolePayloadDto.status === OrganizationRoleStatusType.Deleted
    ) {
      await this.addNotifications({
        subscriptionId,
        type: NotificationType.Notice,
        userId,
        emails: [targetUserRole.user.userProvider.email],
        title: '조직 제외 알림',
        content: `${subscription.name} 조직에서 ${targetUserRole.user.userProvider.name}님을 제외했습니다.`,
      });

      if (targetUserRole.user.userProvider.mailing) {
        await this.emailsService.sendNoticeMail(targetUserRole.user.userProvider.email, {
          title: '조직 제외 알림',
          content: `${subscription.name} 조직에서 ${targetUserRole.user.userProvider.name}님을 제외했습니다.`,
          toUserName: targetUserRole.user.userProvider.name,
          organizationName: subscription.name,
        });
      }

      await this.initializeCurrentOrganization(targetUserRole.user.id);
    }

    if (
      targetUserRole.status === OrganizationRoleStatusType.Deactivated &&
      updateOrganizationRolePayloadDto.status === OrganizationRoleStatusType.Joined
    ) {
      await this.addNotifications({
        subscriptionId,
        type: NotificationType.Notice,
        userId,
        emails: [targetUserRole.user.userProvider.email],
        title: '조직 권한 복구 알림',
        content: `${subscription.name} 조직에서 ${targetUserRole.user.userProvider.name}님의 역할을 복구했습니다.`,
      });

      if (targetUserRole.user.userProvider.mailing) {
        await this.emailsService.sendNoticeMail(targetUserRole.user.userProvider.email, {
          title: '조직 권한 복구 알림',
          content: `${subscription.name} 조직에서 ${targetUserRole.user.userProvider.name}님의 역할을 복구했습니다.`,
          toUserName: targetUserRole.user.userProvider.name,
          organizationName: subscription.name,
        });
      }
    }
  }
}
