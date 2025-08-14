import { Permission } from '@/permissions/entities/permission.entity';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { NotFoundOrganizationRoleExceptionDto } from '@/subscriptions/organization-roles/dto/exception/not-found-organization-role.exception.dto';
import { GetUserOrganizationsNestedResponseDto } from '@/subscriptions/organization-roles/dto/response/get-user-organizations.nested.response.dto';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { OrmHelper } from '@util/orm.helper';
import { DeleteResult, FindOptionsWhere } from 'typeorm';

export abstract class BaseRepository {
  constructor(protected readonly orm: OrmHelper) {}

  abstract existsBy<T>(condition: FindOptionsWhere<T>): Promise<boolean>;

  abstract existsByWithDeleted<T>(condition: FindOptionsWhere<T>): Promise<boolean>;

  abstract softDelete(id: number): Promise<DeleteResult>;

  async getCurrentOrganization(userId: number): Promise<Subscription & { permission: Permission }> {
    const organizationRole = await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .leftJoinAndSelect('or.subscription', 's')
      .leftJoinAndSelect('s.plan', 'pl')
      .leftJoinAndSelect('pl.planGrants', 'plg')
      .leftJoinAndMapOne('s.permission', Permission, 'p', 'p.id = or.permissionId')
      .leftJoinAndSelect('p.permissionGrants', 'pmg')
      .where('or.userId = :userId', { userId })
      .andWhere('or.isActive = 1')
      .getOne();

    if (!organizationRole) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    return organizationRole.subscription as Subscription & { permission: Permission };
  }

  async getUserOrganizations(userId: number): Promise<GetUserOrganizationsNestedResponseDto> {
    const organizationRoles = await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .leftJoinAndSelect('or.subscription', 's')
      .where('or.userId = :userId', { userId })
      .getMany();

    const currentOrganization: Subscription = await this.getCurrentOrganization(userId);

    const organizations = organizationRoles.map((organizationRole) => organizationRole.subscription);
    return { currentOrganization, organizations };
  }
}
