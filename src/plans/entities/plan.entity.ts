import { Payment } from '@/payments/entities/payment.entity';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { PlanNameType } from '../enums/plan-name-type.enum';
import { PlanDiscount } from '../plan-discounts/entities/plan-discount.entity';
import { PlanGrant } from '../plan-grants/entities/plan-grant.entity';
import { PlanBilling } from './plan-billing.entity';

@Entity()
export class Plan extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '플랜 PK' })
  id!: number;

  @Column('varchar', { length: 45, comment: '플랜 이름' })
  name!: PlanNameType;

  @Column('varchar', { default: null, length: 200, nullable: true, comment: '플랜 설명' })
  description!: string | null;

  @OneToOne(() => PlanBilling, (planBilling) => planBilling.plan, {
    cascade: true,
  })
  planBilling!: Relation<PlanBilling>;

  @ManyToOne(() => Subscription, (subscription) => subscription.plans, {
    onDelete: 'NO ACTION',
  })
  subscription!: Relation<Subscription>;

  @OneToMany(() => PlanDiscount, (planDiscount) => planDiscount.plan, {
    cascade: true,
  })
  planDiscounts!: Relation<PlanDiscount>[];

  @OneToMany(() => PlanGrant, (planGrant) => planGrant.plan, {
    cascade: true,
  })
  planGrants!: Relation<PlanGrant>[];

  @OneToMany(() => Payment, (payment) => payment.plan, {
    cascade: true,
  })
  payments!: Relation<Payment>[];
}
