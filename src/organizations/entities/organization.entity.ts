import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { UserRole } from '@share/enums/user-role';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { OrganizationRole } from '../organization-roles/entities/organization-role.entity';

@Entity()
export class Organization extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '구독 아이디' })
  subscriptionId!: number;

  @Column('varchar', { length: 45, comment: '조직 이름' })
  name!: string;

  @Column('varchar', { default: null, length: 200, nullable: true, comment: '조직 설명' })
  description!: string | null;

  @Column('varchar', { length: 45, comment: '기본 역할' })
  defaultRole!: UserRole;

  @OneToMany(() => OrganizationRole, (organizationRole) => organizationRole.organization, {
    cascade: true,
  })
  organizationRoles!: Relation<OrganizationRole>[];

  @OneToOne(() => Subscription, (subscription) => subscription.organization, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn()
  subscription!: Relation<Subscription>;
}
