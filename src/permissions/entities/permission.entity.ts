import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { UserRole } from '@share/enums/user-role';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { PermissionGrant } from '../permission-grants/entities/permission-grant.entity';

@Index('index_permission_sequence', ['sequence'])
@Entity()
export class Permission extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { unique: true, length: 45, comment: '권한 이름' })
  role!: UserRole;

  @Column('varchar', { default: null, length: 200, nullable: true, comment: '권한 설명' })
  description!: string | null;

  @Column('int', { default: 0, unsigned: true, comment: '권한 순서' })
  sequence!: number;

  @Column('tinyint', { default: 0, comment: '권한 비활성 여부' })
  isDeprecated!: boolean;

  @Column('tinyint', { default: 0, comment: '권한 기본 여부' })
  isDefault!: boolean;

  @OneToMany(() => OrganizationRole, (organizationRole) => organizationRole.permission, {
    cascade: true,
  })
  organizationRoles!: Relation<OrganizationRole>[];

  @OneToMany(() => PermissionGrant, (permissionGrant) => permissionGrant.permission, {
    cascade: true,
  })
  permissionGrants!: Relation<PermissionGrant>[];
}
