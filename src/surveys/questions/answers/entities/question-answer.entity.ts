import { Answer } from '@/surveys/entities/answer.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { QuestionOption } from '../../options/entities/question-option.entity';

@Entity()
export class QuestionAnswer extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '설문 PK' })
  answerId!: number;

  @Column('int', { comment: '질문 PK' })
  questionId!: number;

  @Column('int', { default: null, comment: '옵션 PK', nullable: true })
  questionOptionId!: number | null;

  @Column('varchar', { default: null, length: 300, comment: '답변 내용', nullable: true })
  value!: string | null;

  @ManyToOne(() => Question, (question) => question.questionAnswers, {
    onDelete: 'NO ACTION',
  })
  question!: Relation<Question>;

  @ManyToOne(() => QuestionOption, (questionOption) => questionOption.question, {
    onDelete: 'NO ACTION',
  })
  questionOption!: Relation<QuestionOption>;

  @ManyToOne(() => Answer, (answer) => answer.questionAnswers, { onDelete: 'NO ACTION' })
  answer!: Relation<Answer>;
}
