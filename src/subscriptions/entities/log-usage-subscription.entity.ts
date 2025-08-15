import { Plan } from '@/plans/entities/plan.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { User } from '@users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Index('idx_log_usage_subscription_user_id', ['userId'])
@Index('idx_log_usage_subscription_plan_id', ['planId'])
@Index('idx_log_usage_subscription_status', ['status'])
@Index('idx_log_usage_subscription_target', ['target'])
@Index('idx_log_usage_subscription_user_id_plan_id', ['userId', 'planId'])
@Entity()
export class LogUsageSubscription extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '사용자 ID' })
  userId!: number;

  @Column('int', { comment: '플랜 ID' })
  planId!: number;

  @Column('varchar', { length: 45, comment: '대상' })
  target!: string;

  @Column('varchar', { length: 45, comment: '상태' })
  status!: SubscriptionStatusType;

  @Column('int', { default: 0, unsigned: true, comment: '사용량' })
  usage!: number;

  @Column('int', { default: 0, unsigned: true, comment: '남은 사용량' })
  remain!: number;

  @Column('int', { default: 0, unsigned: true, comment: '총 사용량' })
  total!: number;

  @ManyToOne(() => User, (user) => user.logUsageSubscriptions, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  user!: Relation<User>;

  @ManyToOne(() => Plan, (plan) => plan.logUsageSubscriptions, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  plan!: Relation<Plan>;
}
