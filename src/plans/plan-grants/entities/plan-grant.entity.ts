import { Plan } from '@/plans/entities/plan.entity';
import { PlanGrantConstraintsTypeList } from '@/plans/enums/plan-grant-constraints-type.enum';
import { PlanGrantType } from '@/plans/enums/plan-grant-type.enum';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Index(['constraints'], { fulltext: true })
@Entity()
export class PlanGrant extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '플랜 권한 PK' })
  id!: number;

  @Column('int', { comment: '플랜 PK' })
  planId!: number;

  @Column('varchar', { length: 45, comment: '권한 이름' })
  type!: PlanGrantType;

  @Column('varchar', { default: null, length: 200, nullable: true, comment: '권한 설명' })
  description!: string | null;

  @Column('varchar', { default: null, length: 100, nullable: true, comment: `권한 제약 여부\n\n${PlanGrantConstraintsTypeList.join('\n')}` })
  constraints!: string | null;

  @Column('int', { default: null, nullable: true, unsigned: true, comment: '허용 개수' })
  amount!: number | null;

  @Column('tinyint', { default: 0, comment: '갱신 가능 여부' })
  isRenewable!: boolean;

  @Column('tinyint', { default: 1, comment: '권한 허용 여부' })
  isAllowed!: boolean;

  @ManyToOne(() => Plan, (plan) => plan.planGrants, {
    onDelete: 'NO ACTION',
  })
  plan!: Relation<Plan>;
}
