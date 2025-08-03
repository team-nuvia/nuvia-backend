import { DataType } from '@share/enums/data-type';
import { InputType } from '@share/enums/input-type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionOption } from './question-option.entity';
import { Survey } from './survey.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 50, comment: '질문 제목' })
  title!: string;

  @Column('varchar', { length: 100, comment: '질문 설명' })
  description!: string;

  @Column('varchar', { length: 50, comment: '질문 유형' })
  inputType!: InputType;

  @Column('varchar', { length: 50, comment: '질문 옵션 유형' })
  dataType!: DataType;

  @Column('tinyint', { comment: '필수 여부', default: false })
  isRequired!: boolean;

  @CreateDateColumn({ type: 'datetime', comment: '생성일시' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '수정일시' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'datetime', select: false, nullable: true, comment: '삭제일시' })
  deletedAt!: Date | null;

  @ManyToOne(() => Survey, (survey) => survey.questions, {
    onDelete: 'CASCADE',
  })
  survey!: Relation<Survey>;

  @OneToMany(() => QuestionOption, (questionOption) => questionOption.question, {
    cascade: true,
  })
  options!: Relation<QuestionOption>[];
}
