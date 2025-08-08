import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Plan } from './plan.entity';

@Entity()
export class PlanBilling extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '플랜 결제 PK' })
  id!: number;

  @Column('int', { comment: '플랜 PK' })
  planId!: number;

  @Column('varchar', { length: 45, comment: '결제 주기' })
  billingCycle!: string;

  @Column('int', { default: 0, unsigned: true, comment: '결제 금액(원)' })
  price!: number;

  @OneToOne(() => Plan, (plan) => plan.planBilling, {
    onDelete: 'NO ACTION',
  })
  plan!: Relation<Plan>;
}
