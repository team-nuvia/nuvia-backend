import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { User } from '@users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { QuestionAnswer } from '../questions/answers/entities/question-answer.entity';
import { Survey } from './survey.entity';

@Entity()
export class Answer extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '설문 PK' })
  surveyId!: number;

  @Column('int', { nullable: true, comment: '유저 PK' })
  userId!: number | null;

  @OneToMany(() => QuestionAnswer, (questionAnswer) => questionAnswer.answer, { cascade: true })
  questionAnswers!: Relation<QuestionAnswer>;

  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'NO ACTION' })
  user!: Relation<User>;

  @ManyToOne(() => Survey, (survey) => survey.answers, { onDelete: 'NO ACTION' })
  survey!: Relation<Survey>;
}
