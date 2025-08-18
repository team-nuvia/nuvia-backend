import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation
} from 'typeorm';
import { Survey } from '../../entities/survey.entity';
import { QuestionAnswer } from '../answers/entities/question-answer.entity';
import { QuestionOption } from '../options/entities/question-option.entity';

@Entity()
export class Question extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '설문 PK', nullable: true })
  surveyId!: number | null;

  @Column('varchar', { length: 50, comment: '질문 제목' })
  title!: string;

  @Column('varchar', { length: 200, nullable: true, comment: '질문 설명' })
  description!: string | null;

  @Column('varchar', { length: 50, comment: '질문 유형' })
  questionType!: QuestionType;

  @Column('varchar', { length: 50, comment: '질문 답변 유형' })
  dataType!: DataType;

  @Column('tinyint', { comment: '필수 여부', default: false })
  isRequired!: boolean;

  @Column('int', { default: 0, unsigned: true, comment: '질문 순서' })
  sequence!: number;

  @ManyToOne(() => Survey, (survey) => survey.questions, {
    onDelete: 'NO ACTION',
  })
  survey!: Relation<Survey>;

  @OneToMany(() => QuestionOption, (questionOption) => questionOption.question, {
    cascade: true,
  })
  questionOptions!: Relation<QuestionOption>[];

  @OneToMany(() => QuestionAnswer, (questionAnswer) => questionAnswer.question, {
    cascade: true,
  })
  answers!: Relation<QuestionAnswer>[];
}
