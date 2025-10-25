import { Plan } from '@/plans/entities/plan.entity';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { Survey } from '@/surveys/entities/survey.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { ResponseFormat } from '@share/enums/response-format';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole } from '@share/enums/user-role';
import { User } from '@users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';

@Unique(['userId', 'planId'])
@Entity()
export class Subscription extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '사용자 아이디' })
  userId!: number;

  @Column('int', { comment: '플랜 아이디' })
  planId!: number;

  @Column('varchar', { length: 45, comment: '조직 이름' })
  name!: string;

  @Column('varchar', { default: null, length: 200, nullable: true, comment: '조직 설명' })
  description!: string | null;

  @Column('varchar', { length: 45, comment: '기본 역할' })
  defaultRole!: UserRole;

  @Column('varchar', { length: 45, comment: '타겟' })
  target!: SubscriptionTargetType;

  @Column('varchar', { length: 45, comment: '상태' })
  status!: SubscriptionStatusType;

  @Column('varchar', { length: 45, default: ResponseFormat.Slide, comment: '응답 렌더 타입' })
  responseFormat!: ResponseFormat;

  @ManyToOne(() => User, (user) => user.subscriptions, {
    onDelete: 'NO ACTION',
  })
  user!: Relation<User>;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions, {
    onDelete: 'NO ACTION',
  })
  plan!: Relation<Plan>;

  @OneToMany(() => Survey, (survey) => survey.subscription, {
    cascade: true,
  })
  surveys!: Relation<Survey>[];

  @OneToMany(() => OrganizationRole, (organizationRole) => organizationRole.subscription, {
    cascade: true,
  })
  organizationRoles!: Relation<OrganizationRole>[];
}
