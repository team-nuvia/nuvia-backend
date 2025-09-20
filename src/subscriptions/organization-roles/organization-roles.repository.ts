import { NotFoundPermissionExceptionDto } from '@/permissions/dto/exception/not-found-permission.exception.dto';
import { Permission } from '@/permissions/entities/permission.entity';
import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { NotFoundSubscriptionExceptionDto } from '../dto/exception/not-found-subscription.exception.dto';
import { Subscription } from '../entities/subscription.entity';
import { NotAllowedUpdateOrganizationRoleExceptionDto } from './dto/exception/not-allowed-update-organization-role.exception.dto';
import { NotFoundOrganizationRoleExceptionDto } from './dto/exception/not-found-organization-role.exception.dto';
import { UpdateOrganizationRolePayloadDto } from './dto/payload/update-organization-role.payload.dto';
import { TableOrganizationRoleNestedResponseDto } from './dto/response/table-organization-role.nested.response.dto';
import { OrganizationRole } from './entities/organization-role.entity';
import { UserRoleList } from '@share/enums/user-role';

@Injectable()
export class OrganizationRolesRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
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
      .leftJoinAndSelect('or.user', 'user')
      .leftJoinAndSelect('or.permission', 'permission')
      .where('or.subscriptionId = :subscriptionId', { subscriptionId })
      .andWhere('or.status IN (:...status)', {
        status: [OrganizationRoleStatusType.Joined, OrganizationRoleStatusType.Deactivated, OrganizationRoleStatusType.Invited],
      })
      .getMany();

    const composedRoles = roles.map((role) => ({
      id: role.id,
      name: role.user.name,
      email: role.user.email,
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
      .findOne({ where: { id: subscriptionId }, relations: ['organizationRoles', 'organizationRoles.permission'] });

    /* 조직 존재 여부 검증 */
    if (!subscription) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    /* 수정 대상 역할 */
    const organizationRole = subscription.organizationRoles.find((role) => role.id === organizationRoleId);

    /* 수정 유저 */
    const updateUserRole = subscription.organizationRoles.find((role) => role.userId === userId);

    /* 조직 역할 존재 여부 검증 */
    if (!updateUserRole || !organizationRole) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    /* 본인 데이터 수정 시도 검증 */
    if (organizationRole.userId === userId) {
      throw new NotAllowedUpdateOrganizationRoleExceptionDto('본인의 역할 정보를 수정할 수 없습니다.');
    }

    /* 조직 생성자 수정 시도 검증 */
    if (organizationRole.userId === subscription.userId) {
      throw new NotAllowedUpdateOrganizationRoleExceptionDto('조직 생성자의 역할 정보를 수정할 수 없습니다.');
    }

    console.log('🚀 ~ OrganizationRolesRepository ~ update ~ updateUserRole:', updateUserRole);
    const isOverRole = UserRoleList.indexOf(updateUserRole.permission.role) < UserRoleList.indexOf(updateOrganizationRolePayloadDto.role);
    if (isOverRole) {
      throw new NotAllowedUpdateOrganizationRoleExceptionDto('본인의 역할보다 높은 역할로 수정할 수 없습니다.');
    }

    const permission = await this.orm.getRepo(Permission).findOne({ where: { role: updateOrganizationRolePayloadDto.role } });

    if (!permission) {
      throw new NotFoundPermissionExceptionDto();
    }

    const updateData = {
      permissionId: permission.id,
      status: updateOrganizationRolePayloadDto.status ? OrganizationRoleStatusType.Joined : OrganizationRoleStatusType.Deactivated,
    };

    return this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .update()
      .set(updateData)
      .where('subscriptionId = :subscriptionId', { subscriptionId })
      .andWhere('id = :organizationRoleId', { organizationRoleId: organizationRoleId })
      .execute();
  }
}
