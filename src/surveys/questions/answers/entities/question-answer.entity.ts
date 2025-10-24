import { Answer } from '@/surveys/entities/answer.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { QuestionOption } from '../../options/entities/question-option.entity';
import { ReferenceBuffer } from './reference-buffer.entity';

@Entity()
export class QuestionAnswer extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '설문 PK' })
  answerId!: number;

  @Column('int', { comment: '질문 PK' })
  questionId!: number;

  @Column('int', { default: null, nullable: true, comment: '옵션 PK' })
  questionOptionId!: number | null;

  @Column('varchar', { default: null, length: 300, nullable: true, comment: '답변 내용' })
  value!: string | null;

  @ManyToOne(() => Question, (question) => question.questionAnswers, {
    onDelete: 'NO ACTION',
  })
  question!: Relation<Question>;

  @ManyToOne(() => QuestionOption, (questionOption) => questionOption.question, {
    onDelete: 'NO ACTION',
  })
  questionOption!: Relation<QuestionOption>;

  @ManyToOne(() => Answer, (answer) => answer.questionAnswers, { onDelete: 'CASCADE' })
  answer!: Relation<Answer>;

  @OneToOne(() => ReferenceBuffer, (referenceBuffer) => referenceBuffer.questionAnswer)
  referenceBuffer!: Relation<ReferenceBuffer>;
}
