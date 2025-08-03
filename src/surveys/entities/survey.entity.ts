import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 50, comment: '설문 제목' })
  title!: string;

  @Column('varchar', { length: 300, comment: '설문 설명' })
  description!: string;

  @Column('tinyint', { comment: '공개 여부', default: true })
  isPublic!: boolean;

  @Column('datetime', { nullable: true, comment: '만료일시', default: null })
  expiresAt!: Date | null;

  @CreateDateColumn({ type: 'datetime', comment: '생성일시' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '수정일시' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'datetime', select: false, nullable: true, comment: '삭제일시' })
  deletedAt!: Date | null;

  @OneToMany(() => Question, (question) => question.survey, {
    cascade: true,
  })
  questions!: Relation<Question>[];
}
