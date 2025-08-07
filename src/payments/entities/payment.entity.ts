import { Plan } from '@/plans/entities/plan.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { PaymentStatus } from '@share/enums/payment-status';
import { User } from '@users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class Payment extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '결제 PK' })
  id!: number;

  @Column('int', { comment: '플랜 PK' })
  planId!: number;

  @Column('int', { comment: '사용자 PK' })
  userId!: number;

  /* 관계형 없이 제공해야하는 필드 */
  @Column('int', { default: null, nullable: true, comment: '플랜 할인 PK' })
  planDiscountId!: number | null;

  @Column('varchar', { length: 45, comment: '이메일' })
  email!: string;

  @Column('varchar', { length: 45, comment: '사용자 이름' })
  username!: string;

  @Column('varchar', { length: 45, comment: '카드사 정보' })
  cardCompany!: string;

  @Column('varchar', { length: 45, comment: '결제 타입' })
  cardNumber!: string;

  @Column('varchar', { length: 45, comment: '결제 방식' })
  paymentMethod!: string;

  @Column('int', { default: 0, unsigned: true, comment: '결제 금액' })
  paymentAmount!: number;

  @Column('varchar', { length: 45, comment: '결제 상태' })
  status!: PaymentStatus;

  @Column('tinyint', { default: 0, comment: '세액 포함 여부' })
  hasTax!: boolean;

  @Column('int', { default: null, nullable: true, unsigned: true, comment: '세액' })
  taxAmount!: number | null;

  @Column('tinyint', { default: 0, comment: '할인 적용 여부' })
  isDiscounted!: boolean;

  @Column('int', { default: null, nullable: true, unsigned: true, comment: '할인 금액' })
  discountAmount!: number | null;

  @Column('float', { default: null, nullable: true, unsigned: true, comment: '할인 퍼센트' })
  discountRate!: number | null;

  @Column('varchar', { default: null, length: 45, nullable: true, comment: '할인 코드' })
  discountCode!: string | null;

  @Column('int', { default: 0, unsigned: true, comment: '결제 총액' })
  totalAmount!: number;

  @ManyToOne(() => User, (user) => user.payments, {
    onDelete: 'NO ACTION',
  })
  user!: Relation<User>;

  @ManyToOne(() => Plan, (plan) => plan.payments, {
    onDelete: 'NO ACTION',
  })
  plan!: Relation<Plan>;
}
