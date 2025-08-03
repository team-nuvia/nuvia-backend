import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class QuestionOption {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 50, comment: '옵션 제목' })
  label!: string;

  @CreateDateColumn({ type: 'datetime', comment: '생성일시' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '수정일시' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'datetime', select: false, nullable: true, comment: '삭제일시' })
  deletedAt!: Date | null;

  @ManyToOne(() => Question, (question) => question.options, {
    onDelete: 'CASCADE',
  })
  question!: Relation<Question>;
}
