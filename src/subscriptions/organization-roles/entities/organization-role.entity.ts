import { Permission } from '@/permissions/entities/permission.entity';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { User } from '@users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class OrganizationRole extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '구독/조직 아이디' })
  subscriptionId!: number;

  @Column('int', { comment: '사용자 아이디' })
  userId!: number;

  @Column('int', { comment: '권한 아이디' })
  permissionId!: number;

  @Column('tinyint', { default: false, comment: '활성 여부' })
  isActive!: boolean;

  @Column('tinyint', { default: false, comment: '초대 수락 여부' })
  isJoined!: boolean;

  @ManyToOne(() => Subscription, (subscription) => subscription.organizationRoles)
  subscription!: Relation<Subscription>;

  @ManyToOne(() => User, (user) => user.organizationRoles)
  user!: Relation<User>;

  @ManyToOne(() => Permission, (permission) => permission.organizationRoles)
  permission!: Relation<Permission>;
}
