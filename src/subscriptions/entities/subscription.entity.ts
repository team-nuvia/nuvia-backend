import { Organization } from '@/organizations/entities/organization.entity';
import { Plan } from '@/plans/entities/plan.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { User } from '@users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';

@Unique(['userId', 'planId'])
@Entity()
export class Subscription extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { unique: true, comment: '사용자 아이디' })
  userId!: number;

  @Column('int', { comment: '플랜 아이디' })
  planId!: number;

  @Column('varchar', { length: 45, comment: '타겟' })
  target!: SubscriptionTargetType;

  @Column('varchar', { length: 45, comment: '상태' })
  status!: SubscriptionStatusType;

  @OneToOne(() => Organization, (organization) => organization.subscription, {
    cascade: true,
  })
  organization!: Relation<Organization>;

  @OneToOne(() => User, (user) => user.subscription, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn()
  user!: Relation<User>;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions, {
    onDelete: 'NO ACTION',
  })
  plan!: Relation<Plan>;
}
