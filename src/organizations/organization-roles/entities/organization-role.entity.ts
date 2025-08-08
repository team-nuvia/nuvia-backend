import { Organization } from '@/organizations/entities/organization.entity';
import { Permission } from '@/permissions/entities/permission.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { User } from '@users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';

@Unique(['organizationId', 'userId', 'permissionId'])
@Entity()
export class OrganizationRole extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '조직 아이디' })
  organizationId!: number;

  @Column('int', { comment: '사용자 아이디' })
  userId!: number;

  @Column('int', { comment: '권한 아이디' })
  permissionId!: number;

  @ManyToOne(() => Organization, (organization) => organization.organizationRoles)
  organization!: Relation<Organization>;

  @ManyToOne(() => User, (user) => user.organizationRoles)
  user!: Relation<User>;

  @ManyToOne(() => Permission, (permission) => permission.organizationRoles)
  permission!: Relation<Permission>;
}
