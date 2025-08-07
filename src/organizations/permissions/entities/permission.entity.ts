import { Organization } from '@/organizations/entities/organization.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { UserRole } from '@share/enums/user-role';
import { User } from '@users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { PermissionGrant } from '../permission-grants/entities/permission-grant.entity';

@Entity()
export class Permission extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '사용자 아이디' })
  userId!: number;

  @Column('int', { comment: '조직 아이디' })
  organizationId!: number;

  @Column('varchar', { length: 45, comment: '권한 이름' })
  role!: UserRole;

  @Column('varchar', { default: null, length: 200, nullable: true, comment: '권한 설명' })
  description!: string | null;

  @Column('int', { default: 0, unsigned: true, comment: '권한 순서' })
  sequence!: number;

  @Column('tinyint', { default: 0, comment: '권한 비활성 여부' })
  isDeprecated!: boolean;

  @ManyToOne(() => User, (user) => user.permissions, {
    onDelete: 'NO ACTION',
  })
  user!: Relation<User>;

  @ManyToOne(() => Organization, (organization) => organization.permissions, {
    onDelete: 'NO ACTION',
  })
  organization!: Relation<Organization>;

  @OneToMany(() => PermissionGrant, (permissionGrant) => permissionGrant.permission, {
    cascade: true,
  })
  permissionGrants!: Relation<PermissionGrant>[];
}
