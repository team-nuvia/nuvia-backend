import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { QuestionAnswer } from '../../answers/entities/question-answer.entity';
import { Question } from '../../entities/question.entity';

@Entity()
export class QuestionOption extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '질문 PK' })
  questionId!: number;

  @Column('varchar', { length: 50, comment: '옵션 제목' })
  label!: string;

  @Column('varchar', { default: null, length: 200, nullable: true, comment: '옵션 설명' })
  description!: string | null;

  @Column('int', { default: 0, unsigned: true, comment: '옵션 순서' })
  sequence!: number;

  @ManyToOne(() => Question, (question) => question.questionOptions, {
    onDelete: 'CASCADE',
  })
  question!: Relation<Question>;

  @OneToMany(() => QuestionAnswer, (questionAnswer) => questionAnswer.questionOption, {
    cascade: true,
  })
  questionAnswers!: Relation<QuestionAnswer>[];
}
