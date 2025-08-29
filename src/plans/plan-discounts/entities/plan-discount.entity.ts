import { Plan } from '@/plans/entities/plan.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { BoolTinyIntTransformer } from '@common/transformer/bool.transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class PlanDiscount extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '플랜 할인 PK' })
  id!: number;

  @Column('int', { comment: '플랜 PK' })
  planId!: number;

  @Column('varchar', { length: 45, comment: '할인 이름' })
  name!: string;

  @Column('varchar', { length: 45, comment: '할인 유형' })
  type!: string;

  @Column('int', { default: null, nullable: true, unsigned: true, comment: '할인 금액(원)' })
  discountAmount!: number | null;

  @Column('int', { default: null, nullable: true, unsigned: true, comment: '할인 퍼센트' })
  discountPercentage!: number | null;

  @Column('datetime', { default: null, nullable: true, comment: '할인 시작일' })
  startDate!: Date | null;

  @Column('datetime', { default: null, nullable: true, comment: '할인 종료일' })
  endDate!: Date | null;

  @Column('varchar', { default: null, length: 45, nullable: true, comment: '할인 코드' })
  code!: string | null;

  @Column('tinyint', { default: 0, transformer: BoolTinyIntTransformer, comment: '할인 비활성 여부' })
  isDeprecated!: boolean;

  @ManyToOne(() => Plan, (plan) => plan.planDiscounts, {
    onDelete: 'NO ACTION',
  })
  plan!: Relation<Plan>;
}
